import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';

class LocationInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: this.props.data   //If edit is made, set state to new data
        }
    }

    render(){
        return(
            <div>
                <h2>{this.props.data.location_name}</h2>
                <p>Can you dine in? {this.props.data.dine_in}</p>
            </div>
        );
    }

}

/*LocationInfo.PropTypes = {
    data: PropTypes.array
}*/

export default LocationInfo