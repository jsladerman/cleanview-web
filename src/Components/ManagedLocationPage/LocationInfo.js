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

    /*
    TODO:
    data[0] should be data[i] where i is the index of the restaurant that was clicked.
    */

    render(){
        return(
        <div id='location-info-wrapper'>
            <h2>{this.props.data.loc_name}</h2>

            <Container fluid>
                <Row>
                    <Col>
                    <Card.Img variant="top" style={{borderRadius: '8px'}} src={require('../../images/exampleRestaurant.png')}/>
                    </Col>

                    <Col>
                        <p><span className="location-info-field-name">Business Type: </span>{this.props.data.loc_type}</p>
                        {/* TODO:
                            This should have the specific email and phone number for that location.
                            Include this in the database.
                        */}
                        <p><span className="location-info-field-name">Email: </span>example@email.com</p>
                        <p><span className="location-info-field-name">Phone: </span>123-456-7890</p>
                        <p><span className="location-info-field-name">Address:</span> {this.props.data.addr_line_1} {this.props.data.addr_line_2}</p>
                        <p id = "address-line-2-field">{this.props.data.addr_city}, {this.props.data.addr_state}</p>
                    </Col>
                </Row>

                <Row id="covid-survey-row">
                    <Col>
                        {/* COVID-19 practices */}
                        <h5>Your current COVID-19 health practices</h5>
                        <div>
                            {/* <p> <span className="location-info-field-name">Are employees wearing masks? </span>{this.props.data.cleaning_practices.employee_masks}</p>
                            <p> <span className="location-info-field-name">Are tables 6 feet apart? </span>{this.props.data.cleaning_practices.social_distancing}</p>
                            <p> <span className="location-info-field-name">Can customers dine-in? </span>{this.props.data.cleaning_practices.dining_in}</p> */}
                        </div>
                    </Col>
                </Row>

            </Container>
        </div>
        );
    }

}

export default LocationInfo