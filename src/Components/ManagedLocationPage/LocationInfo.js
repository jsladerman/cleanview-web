import React, {Component} from 'react';
import styles from './css/LocationInfo.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

class LocationInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }

    render() {
        const {dining_in_string, social_distancing_string, employee_masks_string} = this.renderCleaningPractice();
        const business_type_format = this.formatBusinessType();
        const imgSrc = this.state.data.imageUrl != null ? this.state.data.imageUrl : require('../../images/exampleRestaurant.png')
        return (
            <div className={styles.locationInfoWrapper}>
                <h2>{this.state.data.loc_name}</h2>

                <Container fluid>
                    <Row>
                        <Col>
                            <Card.Img variant="top" style={{borderRadius: '8px'}}
                                      src={imgSrc}/>
                        </Col>

                        <Col>
                            <p><span
                                className={styles.locationInfoFieldName}>Business Type: </span>{business_type_format}
                            </p>
                            {/* TODO:
                            This should have the specific email and phone number for that location.
                            Include this in the database.
                        */}
                            <p><span className={styles.locationInfoFieldName}>Email: </span>example@email.com</p>
                            <p><span className={styles.locationInfoFieldName}>Phone: </span>123-456-7890</p>
                            <p><span
                                className={styles.locationInfoFieldName}>Address:</span>
                                {this.state.data.addrLine1}
                                {' ' + this.state.data.addrLine2}
                            </p>
                            <p style={{textIndent: '4.65em'}}>{this.state.data.addrCity}, {this.state.data.addrState}, {this.state.data.addrZip}</p>
                        </Col>
                    </Row>

                    <Row className={styles.covidSurveyRoad}>
                        <Col>
                            {/* COVID-19 practices */}
                            <h5>Your current COVID-19 health practices</h5>
                            <div>
                                <p><span
                                    className={styles.locationInfoFieldName}>Are employees wearing masks? </span>
                                    {employee_masks_string}
                                </p>
                                <p><span
                                    className={styles.locationInfoFieldName}>Are tables 6 feet apart? </span>
                                    {social_distancing_string}
                                </p>
                                <p><span
                                    className={styles.locationInfoFieldName}>Can customers dine-in? </span>
                                    {dining_in_string}
                                </p>
                            </div>
                        </Col>
                    </Row>

                </Container>
            </div>
        );
    }

    intToYN = (i) => {
        if (!i) {
            return 'No'
        }
        return 'Yes'
    }

    renderCleaningPractice = () => {
        console.log(this.state.data)
        const outsideSeating = this.intToYN(this.state.data.covidResponseSurvey.outsideSeating);
        const social_distancing = this.intToYN(this.state.data.covidResponseSurvey.socialDistancing);
        const employee_masks = this.intToYN(this.state.data.covidResponseSurvey.employeeMasks);
        return {
            dining_in_string: outsideSeating,
            social_distancing_string: social_distancing,
            employee_masks_string: employee_masks,
        }
    }

    formatBusinessType = () => {
        let business_type_format = '';
        if (this.state.data.loc_type.length === 1) {
            business_type_format = this.state.data.loc_type[0].toUpperCase();
        } else if (this.state.data.loc_type) {
            business_type_format = this.state.data.loc_type[0].toUpperCase() + this.state.data.loc_type.slice(1);
        }
        return business_type_format;
    }

}

export default LocationInfo
