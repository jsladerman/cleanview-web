import React, {Component} from 'react';
import PropTypes from 'prop-types';
import QRCodeGenerator from './QRCodeGenerator'
import AnalyticsDashboard from './AnalyticsDashboard'
import LocationInfo from './LocationInfo'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import {Redirect} from 'react-router-dom';
import MenuManager from './MenuManager';
import {API} from 'aws-amplify';
import Auth from '@aws-amplify/auth';

class ManagedLocationInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            tab: this.props.match.params.tab,
            data: this.props.locations
        }
    }

    componentDidMount = () => {
        this.setLocationInfo();
        const tab = this.state.tab;

        if (tab !== 'info' && tab !== 'qr'
            && tab !== 'analytics' && tab !== 'menu-manager'){
            this.setTabURL('info')
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }
        if (!this.state.data) {
            return <h1>LOADING</h1>;
        }
        return (
            <div className='managedLocationTab'>
                <Tabs activeKey={this.state.tab} onSelect={this.setTabURL}>
                    <Tab eventKey='info' title='Info'>
                        <LocationInfo
                            data={this.state.data}/>
                    </Tab>
                    <Tab eventKey='qr' title='QR Code'>
                        <QRCodeGenerator
                            name={this.state.data.loc_name}
                            id={this.props.id}/>
                    </Tab>
                    <Tab eventKey='analytics' title='Analytics'>
                        <AnalyticsDashboard
                            id={this.props.id}/>
                    </Tab>
                    <Tab eventKey='menu-manager' title='Menu Management'>
                        <MenuManager
                            id={this.props.id}/>
                    </Tab>
                </Tabs>
            </div>
        );
    }

    setLocationInfo = () => {
        if (this.state.data.length) {
            if (!this.findLocationFromArr(this.state.data))
                this.setState({redirect: '/home'})
        } else
            this.pullData();
    }

    pullData = () => {
        Auth.currentUserInfo()
            .then(user => {
                if (user == null)
                    this.setState({redirect: '/login'});
                else
                    this.getLocations(user.username);
            })
            .catch(error => {
                console.log('Error: ' + error)
            });
    };

    getLocations = (managerName) => {
        const apiName = 'manageLocationApi'; // replace this with your api name.
        const path = '/manageLocation'; //replace this with the path you have configured on your API
        const myParams = {
            headers: {},
            response: true,
            queryStringParameters: {
                manager: managerName
            },
        };

        API.get(apiName, path, myParams)
            .then(response => {
                this.setState({data: response['data']})
                if (!this.findLocationFromArr(response['data']))
                    this.setState({redirect: '/home'})
            })
            .catch(error => {
                console.log('Error: ' + error)
            })
    };

    findLocationFromArr = (locations) => {
        for (const index in locations) {
            if (locations[index]['id'] === this.props.id) {
                this.setState({data: locations[index]});
                return true;
            }
        }
        return false;
    }

    setTabURL = (tab) => {
        let newURL = this.props.location.pathname;
        newURL = newURL.split('/').slice(0, -1).join('/') + '/' + tab;
        this.props.history.replace(newURL);
        this.setState({tab: tab});
    }

}

export default ManagedLocationInfo
