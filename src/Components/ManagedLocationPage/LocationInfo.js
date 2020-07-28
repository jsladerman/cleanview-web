import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import './css/LocationInfo.css'

class LocationInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: this.props.data   //If edit is made, set state to new data
        }
    }

    render(){
        console.log(this.state.data)
        return(
        <div>
            <div id="location-info-header">
                <h2>{this.props.data.loc_name}</h2>
                <h4>{this.props.data.manager}</h4>
                <h6 id="location-confirmation">{this.props.data.is_confirmed}</h6>
                {/* <h6>Link: {this.props.data.survey_link}</h6> */}
            </div>

            <div id="location-detailed-info">
                {/* Subscription information */}
                <h5>Subscription information</h5>
                <div>
                    <p><span className="location-info-field-name">Status: </span>{this.props.data.subscription_status}</p>
                    <p><span className="location-info-field-name">Expires: </span>{this.props.data.subscription_end_date}</p>
                </div>

                {/* COVID-19 practices */}
                <h5>Your current COVID-19 health practices</h5>
                <div>
                    <p> <span className="location-info-field-name">Employees wearing masks? </span>{this.props.data.employee_masks}</p>
                    <p> <span className="location-info-field-name">Are tables 6 feet apart? </span>{this.props.data.social_distancing}</p>
                    <p> <span className="location-info-field-name">Can customers dine-in? </span>{this.props.data.cleaning_practices.dining_in}</p>
                </div>

                {/* Location Information */}
                <h5>Location information</h5>
                <div>
                    <p> <span className="location-info-field-name">Business type: </span> {this.props.data.loc_type} </p>
                </div>
                <div>
                    {/* <p><span className="location-info-field-name">Address: </span> {this.props.data.addr_line1}</p> */}
                    <p><span className="location-info-field-name">Address:</span></p>
                    <p>{this.props.data.addr_city} {this.props.data.addr_state}</p>
                </div>
            </div>
        </div>
        );
    }

}

/*LocationInfo.PropTypes = {
    data: PropTypes.array
}*/

export default LocationInfo
