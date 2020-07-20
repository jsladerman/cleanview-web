import React, {Component} from 'react';
import styles from './css/Dashboard.module.css';
import Auth from "@aws-amplify/auth";
import {API} from "aws-amplify";
import DashboardTopNav from "../Components/Dashboard/DashboardTopNav";
import DashboardSidebarContent from "../Components/Dashboard/DashboardSidebarContent";
import Modal from '@trendmicro/react-modal';
import '@trendmicro/react-modal/dist/react-modal.css';
import AddLocation from "../Components/Dashboard/AddLocation";
import Sidebar from 'react-sidebar'
import LocationsTable from "../Components/Dashboard/LocationsTable";
import ClickableOverlay from "../Components/Custom/ClickableOverlay";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            managerName: '',
            dashboardHeader: '',
            locationData: [
                {loc_name: 'test1', a: '1'},
                {loc_name: 'test2', a: '2'},
                {loc_name: 'test3', a: '3'},
            ]
        }
    }

    componentDidMount() {
        this.getData();
    }

    render() {
        return (
            <div className={styles.dashboard}>
                <DashboardTopNav/>
                <Sidebar
                    sidebar={
                        <DashboardSidebarContent/>
                    }
                    children={
                        <div className={styles.sidebarChildren}>
                            <Modal show={this.state.showModal}
                                   onClose={this.toggleModal}
                                   showCloseButton={false}
                                   style={{borderRadius: '100px'}}>
                                <AddLocation/>
                            </Modal>
                            <div className={styles.dashboardHeader}>
                                <h1 className={styles.dashboardHeaderText}>{this.state.dashboardHeader}</h1>
                                <div className={styles.addLocationButtonDiv} onClick={this.toggleModal}>
                                    <ClickableOverlay borderRadius='12px'>
                                        <img className={styles.addLocationButton}
                                             src={require("../images/addLocationButton.png")}/>
                                    </ClickableOverlay>
                                </div>
                            </div>
                            <LocationsTable
                                locations={this.state.locationData}/>
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
        Auth.currentUserInfo()
            .then(user => {
                console.log(user.username);
                this.setState({
                    managerName: user.username,
                    dashboardHeader: user.username + '\'s Locations'
                });
                const apiName = 'manageLocationApi'; // replace this with your api name.
                const path = '/manageLocation'; //replace this with the path you have configured on your API
                const myParams = {
                    headers: {},
                    response: true,
                    queryStringParameters: {
                        manager: user.username
                    },
                };

                API.get(apiName, path, myParams)
                    .then(response => {
                        this.setState({
                            // locationData: [response["data"]],
                        });
                        console.log(response)
                    })
                    .catch(error => {
                        console.log("Error: " + error)
                    })
            })
            .catch(error => "Error: " + error);
    };

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal
        });
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
