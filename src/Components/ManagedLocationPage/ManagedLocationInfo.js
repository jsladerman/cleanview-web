import React, {Component} from 'react';
import PropTypes from 'prop-types';
import QRCodeGenerator from './QRCodeGenerator'
import AnalyticsDashboard from './AnalyticsDashboard'
import LocationInfo from './LocationInfo'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import {Redirect} from "react-router-dom";
import MenuManager from './MenuManager';

class ManagedLocationInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            data: null
        }
    }

    componentDidMount = () => {
        if (!this.getLocationData()) {
            console.log("NO MATCH");
            this.setState({redirect: '/home'})
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect}/>
        }
        if (!this.state.data) {
            return null;
        }
        console.log("DATA" + this.state.data);
        return (
            <div className="managedLocationTab">
                <Tabs defaultActiveKey='profile' id='uncontrolled-tab-example'>
                    <Tab eventKey='locationInfo' title='Info'>
                        <LocationInfo data={this.state.data}/>
                    </Tab>
                    <Tab eventKey='qrCode' title='QR Code'>
                        <QRCodeGenerator/>
                    </Tab>
                    <Tab eventKey='analyticsDashboard' title='Analytics'>
                        <AnalyticsDashboard/>
                    </Tab>
                    <Tab eventKey='menuManager' title="Menu Management">
                        <MenuManager />
                    </Tab>
                </Tabs>
            </div>
        );
    }

    getLocationData = () => {
        const locations = this.props.locations;
        for (const index in locations) {
            if (locations[index]['id'] === this.props.id) {
                this.setState({data: locations[index]});
                return true;
            }
        }
        return false;
    }

}

export default ManagedLocationInfo
