import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QRCodeGenerator from './QRCodeGenerator'
import AnalyticsDashboard from './AnalyticsDashboard'
import LocationInfo from './LocationInfo'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import {API} from 'aws-amplify';
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
    
    getData = () => {
        const apiName = 'manageLocationApi';
        const path = '/manageLocation';
        const myParams = {
            headers: {},
            response: true,
            queryStringParameters: {
                id: '4323841-865-8664-ce7a-f32b7b13dcbd'
            },
        };

        API.get(apiName, path, myParams)
            .then(response => {
                this.setState({
                    data: response["data"][0],
                });
                console.log(this.state.data)
            })
            .catch(error => {
                console.log("Error: " + error)
            })
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