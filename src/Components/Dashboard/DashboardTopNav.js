import React, {Component} from 'react';
import styles from './css/DashboardTopNav.module.css';
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'

class DashboardTopNav extends Component {
    render() {
        return (
            <Navbar sticky='top' style={{backgroundColor: '#191A26'}}>
                <Navbar.Brand href="/home">
                    <img
                        src={require("../../images/CleanView-Icon-White 1.svg")}
                        alt=''
                        height="50px"
                    />
                </Navbar.Brand>
                <Navbar.Collapse/>
                <Button style={{
                    marginRight: '5%',
                    fontWeight: 'bold',
                    fontFamily: 'Roboto',
                    color: '#191A25'
                }}
                        variant='light'
                        onClick={this.props.signOutFunc}>
                    Sign Out
                </Button>
            </Navbar>
        );
    }
}

export default DashboardTopNav;
