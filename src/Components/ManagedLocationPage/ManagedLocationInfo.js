import React, {Component} from 'react';
import styles from './css/ManagedLocationInfo.module.css'
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
import EditLocationInfo from "./EditLocationInfo";
import Modal from "@trendmicro/react-modal";

class ManagedLocationInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            showModal: false,
            tab: this.props.match.params.tab,
            data: []
        }
        this.handleUpdate = this.handleUpdate.bind(this);
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
            <div>
                <Modal
                    show={this.state.showModal}
                    onClose={this.toggleModal}
                    showCloseButton={true}
                    style={{ borderRadius: "100px" }}
                >
                    <EditLocationInfo
                        data={this.state.data}
                        handleUpdate={this.handleUpdate}
                        handleDelete={this.handleDelete}
                    />
                </Modal>
                <div style={{padding: '35px 70px'}}>
                    <div style={{cursor: 'pointer'}} onClick={() => this.setState({redirect: '/home/locations'})}>
                        <img src={require('../../images/back-arrow.svg')}
                             style={{
                                 float: 'left',
                                 margin: '1px 0 8px -33px',
                                 height: '20px'
                             }}
                             alt=''/>
                        Locations
                    </div>
                    <div style={{display: 'flex', margin: '5px 0'}}>
                        <h2 style={{fontWeight: '900', fontFamily: 'Roboto, serif'}}>
                            {this.state.data.loc_name + ' '}
                            <span style={{fontWeight: '300'}}>
                            | {this.state.data.addrCity}
                        </span>
                            <span style={{marginLeft: '20px'}} onClick={this.toggleModal}><BsPencil
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
                    this.loadData();
            })
            .catch(error => {
                console.log('Error: ' + error)
            });
    };

    loadData = () => {
        const apiName = "ManageLocationApi";
        const path = "/location/object";
        const requestData = {
            headers: {},
            response: true,
            queryStringParameters: {
                id: this.props.id,
            },
        };

        API.get(apiName, path, requestData)
            .then((response) => {
                let currState = this.state;
                currState.data = response.data.body;
                this.setState(currState);
            })
            .catch((error) => {
                console.log("Error: " + error);
            });
    };

    setTabURL = (tab) => {
        let newURL = this.props.location.pathname;
        newURL = newURL.split('/').slice(0, -1).join('/') + '/' + tab;
        this.props.history.replace(newURL);
        this.setState({tab: tab});
    }

    handleUpdate = async () => {
        this.toggleModal();
        this.props.handleUpdate();
        this.loadData();
    };

    handleDelete = async () => {
        this.toggleModal();
        this.props.handleUpdate();
        this.setState({ redirect: '/home/locations' });
    }

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    };

}

export default ManagedLocationInfo
