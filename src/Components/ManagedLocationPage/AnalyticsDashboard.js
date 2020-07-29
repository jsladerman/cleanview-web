import React, { Component } from 'react';
import FilteredDataToPieChart from './FilteredDataToCharts/FilteredDataToPieChart';
import FilteredDataToAgeBarChart from './FilteredDataToCharts/FilteredDataToAgeBarChart';
import FilteredDataToRatingBarChart from './FilteredDataToCharts/FilteredDataToRatingBarChart';
import FilteredDataToFrequencyChart from './FilteredDataToCharts/FilteredDataToFrequencyChart';
import styles from './css/AnalyticsDashboard.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
// import Checkbox from 'react-bootstrap/Checkbox';

class AnalyticsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurantSurveyResponses: [],
            filteredData: [],
            ageExcludeFilter: ['0-17', '66+'],
            touristExcludeFilter: ['1'],

            // QR filter
            // Timestamp filter- default is 0 hours = all data, else show from the past "x" hours
        }
    }

    componentDidMount = () => {
        this.populateStateWithJson();
        this.filterData();
    }

    handleClick(cb) {
       console.log("Clicked, new value = " + cb.checked);
    }

    render() {
        if(this.state.restaurantSurveyResponses.length === 0){
            return(
                <div> LOADING </div>
            )
        }
        return (
            <div className={styles.analDash} style={{ paddingLeft: "20px" }}>
                <h2>Analytics Dashboard</h2>
                <p><span className={styles.fieldHeader}>Average Rating: </span> {this.averageRating()} / 5</p>
                <p><span className={styles.fieldHeader}>Total # of Reviews: </span> {this.state.restaurantSurveyResponses.length} </p>

                <br />

                <Container fluid>
                    <h4 className={styles.analyticsDashboardSubheader}>Customer Demographic Information</h4>
                    <Row className={styles.rowDivider}>
                        <Col>
                            <FilteredDataToAgeBarChart
                                filteredData={this.state.restaurantSurveyResponses}
                            />
                        </Col>
                        
                        <Col>
                            <FilteredDataToPieChart
                                filteredData={this.state.restaurantSurveyResponses}
                                keyString='tourist-diner'
                                titleText='Are your diners tourists?'
                            />
                        </Col>
                    </Row>

                    <h4 className={styles.analyticsDashboardSubheader}>Survey Responses</h4>
                    <Row id={styles.filterCharts} className={styles.rowDivider}>
                        <Col>
                            <p>Filter Charts</p>
                        </Col>
                    </Row>

                    <Row className={styles.rowDivider}>
                        <Col>
                            <FilteredDataToRatingBarChart
                            filteredData={this.state.filteredData}
                            />
                        </Col>

                        <Col>
                            <FilteredDataToFrequencyChart
                            filteredData={this.state.filteredData}
                            />
                        </Col>
                    </Row>

                    <Row className={styles.rowDivider}>
                        <Col>
                            <FilteredDataToPieChart
                            filteredData={this.state.filteredData}
                            keyString='employee-masks'
                            titleText='Are your employees wearing masks?'
                            />
                        </Col>

                        <Col>
                            <FilteredDataToPieChart
                            filteredData={this.state.filteredData}
                            keyString='six-feet'
                            titleText='Are your tables at least 6 feet apart?'
                            />
                        </Col>
                    </Row>
                </Container>

            </div>
        );
    }

    populateStateWithJson = () => {
        let currState = this.state;
        currState.restaurantSurveyResponses = require('./data/mock_records.json');
        currState.filteredData = currState.restaurantSurveyResponses;
        this.setState(currState);
    }

    filterData = () => {
        let newFilteredData = this.state.restaurantSurveyResponses.filter(response =>
            (!this.state.touristExcludeFilter.includes(response['tourist-diner']) && !this.state.ageExcludeFilter.includes(response['age']) )
        );
        this.setState({filteredData: newFilteredData});
    }

    averageRating = () => {
        let total = 0.0;
        for (var i = 0; i < this.state.restaurantSurveyResponses.length; i++) {
            var obj = this.state.restaurantSurveyResponses[i];
            total += parseFloat(obj['response-rating']);
        }
        return total / this.state.restaurantSurveyResponses.length;
    }

    // Create functions that use this.state.restaurantSurveyResponses and manipulate data

    /*
    pullData = () => {
        Auth.currentUserInfo()
            .then(user => {
                if (user == null)
                    this.setState({redirect: '/login'});
                else
                    this.getRestaurantSurveyData({this.props.id});
            })
            .catch(error => {
                consoler.log('Error: ' + error)
            });
    }

    getRestaurantSurveyData(restaurantID) => {
        const apiName = {PLACEHOLDER};
        const path = {PLACEHOLDER};
        const myParams = {
            headers: {},
            response: true,
            queryStringParameters{
                restaurant_id: restaurantID
            },
        };

        API.get(apiName, path, myParams)
            .then(response => {
                this.setState({restaurantSurveyResponses: response['data']});
            })
            .catch(error => {
                console.log('Error: ' + error);
            })
    }
    */

}

export default AnalyticsDashboard;

