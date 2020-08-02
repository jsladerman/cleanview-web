import React, {Component} from 'react';
import styles from './css/ManagedLocationInfo.module.css'
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
            data: []
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
        if (this.state.data.length === 0) {
            return <img
                src={require("../../images/dashboardLoader.svg")}
                alt=''
                height='100%'
                width='100%'
            />;
        }

        return (
            <div>
                <Tabs activeKey={this.state.tab} onSelect={this.setTabURL}>
                    <Tab tabClassName={styles.tab} eventKey='info' title='Info'>
                        <LocationInfo
                            data={this.state.data}
                            handleUpdate={this.props.handleUpdate}/>
                    </Tab>
                    <Tab tabClassName={styles.tab} eventKey='qr' title='QR Code'>
                        <QRCodeGenerator
                            name={this.state.data.loc_name}
                            id={this.props.id}/>
                    </Tab>
                    <Tab tabClassName={styles.tab} eventKey='analytics' title='Analytics' unmountOnExit>
                        <AnalyticsDashboard
                            id={this.props.id}
                            sublocations={this.state.data.sublocations}/>
                    </Tab>
                    <Tab tabClassName={styles.tab} eventKey='menu-manager' title='Menu Management'>
                        <MenuManager
                            id={this.props.id}/>
                    </Tab>
                </Tabs>
            </div>
        );
    }

    setLocationInfo = () => {
        if (this.props.data) {
            if (!this.findLocationFromArr(this.props.data))
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
        const apiName = 'ManageLocationApi';
        const path = '/location';
        const myParams = {
            headers: {},
            response: true,
            queryStringParameters: {
                manager: managerName
            },
        };

        API.get(apiName, path, myParams)
            .then(response => {
                if (!this.findLocationFromArr(response['data'].data))
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
