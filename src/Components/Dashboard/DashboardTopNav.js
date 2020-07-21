import React, {Component} from 'react';
import styles from './css/DashboardTopNav.css';
import Navbar from 'react-bootstrap/Navbar'

class DashboardTopNav extends Component {
    render() {
        return (
            <Navbar sticky='top' bg='dark' variant='dark'>
                <Navbar.Brand href="/home">
                    <img
                        src={require("../../images/CleanView-Logo-White-text.svg")}
                        alt=''
                        height="75px"
                    />
                </Navbar.Brand>
            </Navbar>
        );
    }
}

export default DashboardTopNav;
