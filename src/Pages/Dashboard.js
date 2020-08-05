import React, {Component} from 'react';
import styles from './css/Dashboard.module.css';
import Auth from "@aws-amplify/auth";
import {API} from "aws-amplify";
import {
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import DashboardTopNav from "../Components/Dashboard/DashboardTopNav";
import DashboardSidebarContent from "../Components/Dashboard/DashboardSidebarContent";
import '@trendmicro/react-modal/dist/react-modal.css';
import Sidebar from 'react-sidebar'
import LocationsTable from "../Components/Dashboard/LocationsTable";
import ManagedLocationInfo from "../Components/ManagedLocationPage/ManagedLocationInfo";
import Settings from "../Pages/Settings";
import SettingsBox from "../Components/Dashboard/SettingsBox";
import Modal from "@trendmicro/react-modal";
import Alert from "react-bootstrap/Alert";
import Billing from "../Pages/Billing";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            phoneNumError: false,
            authLoaded: false,
            authInfo: null,
            settingsInfo: null,
            settingsLoaded: false,
            locationData: [],
            backendEnv: 'dev',
        }
        this.path = this.props.match.path;
    }

    componentDidMount() {
        this.loadAuthInfo();
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect}/>
        }
        return (
            <div className={styles.dashboard}>
                <DashboardTopNav signOutFunc={this.signOut}/>
                <Sidebar
                    sidebar={
                        <DashboardSidebarContent
                            path={this.props.location.pathname}
                            parentRedirectFunc={this.redirect}/>
                    }
                    children={
                        this.renderSidebarChildren()
                    }
                    transitions={false}
                    docked={true}
                    defaultSidebarWidth={0}
                    styles={jsStyles.sidebar.styles}/>
            </div>
        );
    };

    renderSidebarChildren = () => {
        if (!this.state.authLoaded || !this.state.settingsLoaded) {
            return <img
                src={require("../images/dashboardLoader.svg")}
                alt=''
                height='100%'
                width='100%'
            />
        }
        if (JSON.stringify(this.state.settingsInfo) === '{}') {
            return (
                <Modal show={true}
                       showCloseButton={false}
                       style={{
                           backgroundColor: 'transparent',
                           border: '0',
                           boxShadow: '0 0 0 0 rgba(0,0,0,0)'
                       }}>
                    <div className={styles.settingsModalDiv}
                         style={{height: this.state.phoneNumError ? '473px' : '375px'}}>
                        <h1 style={{textAlign: 'center', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif'}}>
                            Welcome to CleanView!
                        </h1>
                        <h4 style={{textAlign: 'center', fontFamily: 'Roboto, sans-serif'}}>
                            Please complete your profile
                        </h4><br/>
                        {this.renderErrorAlert('Phone number must be in this format: 800-555-1234')}
                        <SettingsBox
                            authInfo={this.state.authInfo}
                            submitFunc={(values) => this.createSettings(values)}
                            phoneNumErrorFunc={this.triggerErrorAlert}
                        />
                    </div>
                </Modal>
            )
        }
        return (
            <div className={styles.sidebarChildren}>
                <Switch>
                    <Redirect exact from="/home" to="/home/locations"/>
                    <Route path={this.path + '/locations/:id/:tab'} render={(props) =>
                        <ManagedLocationInfo
                            {...props}
                            id={props.match.params.id}
                            tab={props.match.params.tab}
                            locations={this.state.locationData}
                            handleUpdate={this.getData}
                        />}
                    />
                    <Route path={this.path + '/locations'} render={(props) =>
                        <LocationsTable
                            {...props}
                            managerName={this.state.settingsInfo.firstName}
                            locations={this.state.locationData}
                            backendEnv={this.state.backendEnv}
                            getDataFunc={this.getData}/>}
                    />
                    <Route exact path={this.path + '/billing'} render={(props) =>
                        <Billing {...props}/>
                    }
                    />
                    <Route path={this.path + '/settings'} render={(props) =>
                        <Settings
                            authInfo={this.state.authInfo}
                            authLoaded={this.state.authLoaded}
                            authLoadFunc={this.loadAuthInfo}
                            settingsInfo={this.state.settingsInfo}
                            getSettingsFunc={this.getSettings}
                            {...props}/>}
                    />
                    <Redirect to="/home/locations"/>
                </Switch>
            </div>
        );
    }

    getData = () => {
        const apiName = 'ManageLocationApi'; // replace this with your api name.
        const path = '/location'; //replace this with the path you have configured on your API
        const myParams = {
            headers: {},
            response: true,
            queryStringParameters: {
                manager: this.state.authInfo.username
            },
        };

        API.get(apiName, path, myParams)
            .then(response => {
                this.setState({
                    locationData: response["data"].data,
                    backendEnv: response["data"].backendEnv
                });
            })
            .catch(error => {
                console.log("Error: " + error)
            })
    };

    signOut = () => {
        try {
            Auth.signOut()
                .then(response => {
                    this.setState({redirect: '/login'});
                });
        } catch (error) {
            console.log('Error signing out: ', error);
        }
    };

    getSettings = (accountId) => {
        let apiName = 'AccountSettingsApi'
        let path = '/account/manager'
        const requestParams = {
            headers: {},
            queryStringParameters: {
                id: accountId
            }
        }

        API.get(apiName, path, requestParams)
            .then(response => {
                this.setState({settingsInfo: response, settingsLoaded: true})
            })
            .catch(error => {
                console.log('Error: ' + error)
            })
    }

    createSettings = (params) => {
        let apiName = 'AccountSettingsApi'
        let path = '/account'
        const requestParams = {
            headers: {},
            body: {
                id: this.state.authInfo.username, // mandatory
                email: this.state.authInfo.attributes.email,
                username: this.state.authInfo.username,
                firstName: params.firstName,
                lastName: params.lastName,
                phone: params.phone,
                creationDate: new Date().toLocaleString()
            }
        }

        API.post(apiName, path, requestParams)
            .then(response => {
                console.log('Settings created successfully: ' + response);
                this.getSettings(this.state.authInfo.username)
            })
            .catch(error => {
                console.log('Error in settings create: ' + error)
            })

    }

    triggerErrorAlert = () => {
        this.setState({phoneNumError: true});
    }

    renderErrorAlert = (error) => {
        if (this.state.phoneNumError)
            return (
                <Alert variant="danger" dismissible
                       onClose={() => this.setState({phoneNumError: false})}
                       style={{whiteSpace: 'normal'}}>
                    <Alert.Heading>Error</Alert.Heading>
                    <div>
                        {error}
                    </div>
                </Alert>
            )
    }

    redirect = (path) => {
        this.setState({redirect: '/home' + path},
            () => this.setState({redirect: null}));
    }

    loadAuthInfo() {
        Auth.currentUserInfo()
            .then(user => {
                if (user == null) {
                    this.setState({redirect: '/login'});
                } else {
                    this.setState({
                        authLoaded: true,
                        authInfo: user
                    });
                    this.getSettings(user.username);
                    this.getData();
                }
            })
            .catch(error => {
                console.log("Error: " + error)
            });

    }
}

const jsStyles = {
    sidebar: {
        styles: {
            root: {top: '75px'},
            sidebar: {width: '175px', backgroundColor: '#191A26'},
            overlay: {backgroundColor: 'transparent'}
        }
    }
}

export default Dashboard;
