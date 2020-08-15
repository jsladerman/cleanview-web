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
import {BsPencil} from "react-icons/bs/index";

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
            && tab !== 'analytics' && tab !== 'menu-manager') {
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
            <div style={{padding: '40px'}}>
                <div>
                    Locations
                </div>
                <div style={{display: 'flex', margin: '5px 0'}}>
                    <h2 style={{fontWeight: '900', fontFamily: 'Roboto, serif'}}>{this.state.data.loc_name}
                        <span style={{marginLeft: '100px'}} onClick={this.toggleModal}><BsPencil
                            className={styles.editButton}/></span>
                    </h2>
                </div>
                <Tabs className={styles.tabsWrapper} activeKey={this.state.tab} onSelect={this.setTabURL}
                      unmountOnExit={true} variant='pills'>
                    <Tab tabClassName={this.state.tab === 'info' ? styles.active : null}
                         eventKey='info' title='Information'>
                        <div style={{marginLeft: '-30px'}}>
                            <LocationInfo
                                data={this.state.data}
                                handleUpdate={this.props.handleUpdate}/>
                        </div>
                    </Tab>
                    <Tab tabClassName={this.state.tab === 'qr' ? styles.active : null}
                         eventKey='qr' title='QR Code'>
                        <div style={{marginLeft: '-30px'}}>
                            <QRCodeGenerator
                                name={this.state.data.loc_name}
                                id={this.props.id}/>
                        </div>
                    </Tab>
                    <Tab tabClassName={this.state.tab === 'analytics' ? styles.active : null}
                         eventKey='analytics' title='Analytics' unmountOnExit>
                        <div style={{marginLeft: '-30px'}}>
                            <AnalyticsDashboard
                                id={this.props.id}
                                sublocations={this.state.data.sublocations}/>
                        </div>
                    </Tab>
                    <Tab tabClassName={this.state.tab === 'menu-manager' ? styles.active : null}
                         eventKey='menu-manager' title='Menu Management'>
                        <div style={{marginLeft: '-30px'}}>
                            <MenuManager
                                id={this.props.id}
                                sublocations={this.state.data.sublocations}
                                menus={this.state.data.menus}
                                handleUpdate={this.setLocationInfo}
                            />
                        </div>
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
