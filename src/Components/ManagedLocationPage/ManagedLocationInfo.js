import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import QRCodeGenerator from './QRCodeGenerator'
import AnalyticsDashboard from './AnalyticsDashboard'
import LocationInfo from './LocationInfo'
import Nav from 'react-bootstrap/Nav'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
// const { Component } = require("react");

class ManagedLocationInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            //Data: anything we retrieve from the Query
            data: {}
        }
    }

    componentWillMount = () => {
        this.getData();
    }

    //Replace location_id with this.props.location_id
    location_id = '1234';
    getData = () => {
        const response_data = {
            location_name: 'Location 1',
            dine_in: 'true',
        }
        this.setState({data: response_data});   // Setting state as a JSON
    }


    render(){
        return (
            <div class = "managedLocationTab">
                <Tabs defaultActiveKey='profile' id='uncontrolled-tab-example'>
                    <Tab eventKey='locationInfo' title='Info'>
                        <LocationInfo data={this.state.data} />
                    </Tab>
                    <Tab eventKey='qrCode' title='QR Code'>
                        <QRCodeGenerator />
                    </Tab>
                    <Tab eventKey='analyticsDashboard' title='Analytics'>
                        <AnalyticsDashboard />
                    </Tab>
                </Tabs>
            </div>
        );
    }

}

export default ManagedLocationInfo