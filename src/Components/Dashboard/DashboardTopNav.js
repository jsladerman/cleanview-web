import React, {Component} from 'react';
import styles from './css/DashboardTopNav.css';
import Navbar from 'react-bootstrap/Navbar'

class DashboardTopNav extends Component {
    render() {
        return (
            <Navbar sticky='top' variant='dark'>
                <Navbar.Brand href="/home">
                    <img
                        src={require("../../images/CleanView-Icon-White 1.svg")}
                        alt=''
                        height="50px"
                    />
                </Navbar.Brand>
                <Navbar.Collapse/>
                <button style={{marginRight: '10%'}} onClick={this.props.signOutFunc}>
                    Sign Out
                </button>
            </Navbar>
        );
    }
}

export default DashboardTopNav;
