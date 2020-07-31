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
import Settings from "../Components/Dashboard/Settings";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            managerName: null,
            locationData: [],
            backendEnv: 'dev',
        }
        this.path = this.props.match.path;
    }

    componentDidMount() {
        Auth.currentUserInfo()
            .then(user => {
                if (user == null) {
                    this.setState({redirect: '/login'});
                } else {
                    this.setState({
                        managerName: user.username,
                    });
                    this.getData();
                }
            })
            .catch(error => {
                console.log("Error: " + error)
            });
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

    getData = () => {
        console.log("Get Data");
        const apiName = 'ManageLocationApi'; // replace this with your api name.
        const path = '/location'; //replace this with the path you have configured on your API
        const myParams = {
            headers: {},
            response: true,
            queryStringParameters: {
                manager: this.state.managerName
            },
        };

        API.get(apiName, path, myParams)
            .then(response => {
                console.log(response["data"])
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
                    console.log(response);
                    this.setState({redirect: '/login'});
                });
        } catch (error) {
            console.log('Error signing out: ', error);
        }
    };

    redirect = (path) => {
        this.setState({redirect: '/home' + path},
            () => this.setState({redirect: null}));
    }

    renderSidebarChildren = () => {
        if (!this.state.managerName) {
            return <img
                src={require("../images/dashboardLoader.svg")}
                alt=''
                height='100%'
                width='100%'
            />
        } else {
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
                            />}
                        />
                        <Route path={this.path + '/locations'} render={(props) =>
                            <LocationsTable
                                {...props}
                                managerName={this.state.managerName}
                                locations={this.state.locationData}
                                backendEnv={this.state.backendEnv}
                                getDataFunc={this.getData}/>}
                        />
                        <Route exact path={this.path + '/billing'} render={(props) =>
                            <h1 style={{padding: '20px'}}>Billing Page</h1>}
                        />
                        <Route path={this.path + '/settings'} render={(props) =>
                            <Settings
                                {...props}/>}
                        />
                        <Redirect to="/home/locations"/>
                    </Switch>
                </div>
            );
        }
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
