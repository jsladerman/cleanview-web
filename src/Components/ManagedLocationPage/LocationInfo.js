import React, { Component } from 'react';
import './css/LocationInfo.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

class LocationInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: this.props.data
        }
    }

    render(){
        const {dining_in_string, social_distancing_string, employee_masks_string} = this.renderCleaningPractice();
        const business_type_format = this.formatBusinessType();

        return(
        <div id='location-info-wrapper'>
            <h2>{this.state.data.loc_name}</h2>

            <Container fluid>
                <Row>
                    <Col>
                    <Card.Img variant="top" style={{borderRadius: '8px'}} src={require('../../images/exampleRestaurant.png')}/>
                    </Col>

                    <Col>
                        <p><span className="location-info-field-name">Business Type: </span>{business_type_format}</p>
                        {/* TODO:
                            This should have the specific email and phone number for that location.
                            Include this in the database.
                        */}
                        <p><span className="location-info-field-name">Email: </span>example@email.com</p>
                        <p><span className="location-info-field-name">Phone: </span>123-456-7890</p>
                        <p><span className="location-info-field-name">Address:</span> {this.state.data.addr_line_1} {this.state.data.addr_line_2}</p>
                        <p id = "address-line-2-field">{this.state.data.addr_city}, {this.state.data.addr_state}</p>
                    </Col>
                </Row>

                <Row id="covid-survey-row">
                    <Col>
                        {/* COVID-19 practices */}
                        <h5>Your current COVID-19 health practices</h5>
                        <div>
                            <p> <span className="location-info-field-name">Are employees wearing masks? </span>{employee_masks_string}</p>
                            <p> <span className="location-info-field-name">Are tables 6 feet apart? </span>{social_distancing_string}</p>
                            <p> <span className="location-info-field-name">Can customers dine-in? </span>{dining_in_string}</p>
                        </div>
                    </Col>
                </Row>

            </Container>
        </div>
        );
    }

    intToYN = (i) => {
        if(!i){
            return 'No'
        }
        return 'Yes'
    }

    renderCleaningPractice = () =>{
        const dining_in = this.intToYN(this.state.data.cleaning_practices.dining_in);
        const social_distancing = this.intToYN(this.state.data.cleaning_practices.social_distancing);
        const employee_masks = this.intToYN(this.state.data.cleaning_practices.employee_masks);
        return{
            dining_in_string: dining_in,
            social_distancing_string: social_distancing,
            employee_masks_string: employee_masks,
        }
    }

    formatBusinessType = () =>{
        let business_type_format = '';
        if(this.state.data.loc_type.length == 1){
            business_type_format = this.state.data.loc_type[0].toUpperCase();
        } else if(this.state.data.loc_type){
            business_type_format = this.state.data.loc_type[0].toUpperCase() + this.state.data.loc_type.slice(1);
        }
        return business_type_format;
    }

}

export default LocationInfo
