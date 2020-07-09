import React, { Component } from 'react';
import QRCodeGenerator from '../Components/LocationPage/QRCodeGenerator'
import AnalyticsDashboard from '../Components/LocationPage/AnalyticsDashboard'

class LocationPage extends Component {
    constructor() {
        super();
        this.state = {
            name: "BoxMunchers"
        }
    }

    render() {
        return(
        <div>
            <h1 style={{padding:"20px"}}>{this.state.name} Admin Page</h1>
            <div>
                <QRCodeGenerator name={this.state.name} surveyURL={"google.com"} /> 
            </div>
            <AnalyticsDashboard />
        </div>
        );
    }
}

export default LocationPage;