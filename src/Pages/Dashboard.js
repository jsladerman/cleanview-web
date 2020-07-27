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

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            managerName: null,
            locationData: []
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
        console.log('PATH ' + JSON.stringify(this.props))
        return (
            <div className={styles.dashboard}>
                <DashboardTopNav/>
                <Sidebar
                    sidebar={
                        <DashboardSidebarContent signOutFunc={this.signOut}/>
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
        const apiName = 'manageLocationApi'; // replace this with your api name.
        const path = '/manageLocation'; //replace this with the path you have configured on your API
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
                    locationData: response["data"],
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

    renderSidebarChildren() {
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
                        <Redirect exact from="/home" to="/home/locations" />
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
                                getDataFunc={this.getData}/>}
                        />
                        <Redirect to="/home/locations" />
                    </Switch>
                </div>
            );
        }
    }
}

const jsStyles = {
    sidebar: {
        styles: {
            root: {top: '100px'},
            sidebar: {width: '150px', backgroundColor: '#30B3CA'},
            overlay: {backgroundColor: 'transparent'}
        }
    }
}

export default Dashboard;
