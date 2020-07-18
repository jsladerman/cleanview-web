import React, {Component} from 'react';
import styles from './css/DashboardTopNav.css';
import Navbar from 'react-bootstrap/Navbar'
import {AmplifyAuthenticator} from "@aws-amplify/ui-react";

class DashboardTopNav extends Component {
    render() {
        return (
            <Navbar sticky='top' bg='dark' variant='dark'>
                <Navbar.Brand href="/">
                    <img
                        src={require("../../images/CleanView-Logo-White-text.svg")}
                        height="75px"
                    />
                </Navbar.Brand>
            </Navbar>
        );
    }

    constructor(props) {
        super(props);
        this.state = {

        }
    }

}

export default DashboardTopNav;
