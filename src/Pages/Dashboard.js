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
            managerName: '',
            locationData: []
        }
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
            return <Redirect to={this.state.redirect}/>
        }
        const path = this.props.match.path;
        return (
            <div className={styles.dashboard}>
                <DashboardTopNav/>
                <Sidebar
                    sidebar={
                        <DashboardSidebarContent/>
                    }
                    children={
                        <div className={styles.sidebarChildren}>
                            <Switch>
                                <Route path={path + '/locations/:id'} render={(props) =>
                                    <ManagedLocationInfo
                                        {...props}
                                        id={props.match.params.id}
                                        locations={this.state.locationData}/>}
                                />
                                <Route render={(props) =>
                                    <LocationsTable
                                        {...props}
                                        managerName={this.state.managerName}
                                        locations={this.state.locationData}
                                        getDataFunc={this.getData}/>}
                                />
                            </Switch>
                        </div>
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
