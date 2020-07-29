import React, { Component } from 'react';
import FilteredDataToPieChart from './FilteredDataToCharts/FilteredDataToPieChart';
import FilteredDataToAgeBarChart from './FilteredDataToCharts/FilteredDataToAgeBarChart';
import FilteredDataToRatingBarChart from './FilteredDataToCharts/FilteredDataToRatingBarChart';
import FilteredDataToFrequencyChart from './FilteredDataToCharts/FilteredDataToFrequencyChart';
import styles from './css/AnalyticsDashboard.module.css';
import Container from 'react-bootstrap/Container';

class AnalyticsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurantSurveyResponses: [],
            ageFilters: ['0-17', '18-25', '26-35', '36-45', '46-55', '56-65', '66+'],
            touristFilters: ['1', '0'],
            timeFilters: 0,
            // Default is 0 hours = all data, else show from the past "x" hours
        }
    }

    componentDidMount = () => {
        this.populateStateWithJson();
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
                <p><span className={styles.fieldHeader}>Average Rating: </span> * * * * * (4.6)</p>
                <p><span className={styles.fieldHeader}>Total # of Reviews: </span>342</p>

                <br />

                <Container fluid>
                    <h4 className={styles.analyticsDashboardSubheader}>Customer Demographic Information</h4>
                    
                    <FilteredDataToAgeBarChart
                        filteredData={this.state.restaurantSurveyResponses}
                    />
                    
                    <FilteredDataToPieChart
                        filteredData={this.state.restaurantSurveyResponses}
                        keyString='tourist-diner'
                        titleText='Are your diners tourists?'
                    />
                    
                    <FilteredDataToFrequencyChart
                        filteredData={this.state.restaurantSurveyResponses}
                    />

                    <h4 className={styles.analyticsDashboardSubheader}>General Safety Response</h4>
                    
                    <FilteredDataToRatingBarChart
                        filteredData={this.state.restaurantSurveyResponses}
                    />

                    <FilteredDataToPieChart
                        filteredData={this.state.restaurantSurveyResponses}
                        keyString='employee-masks'
                        titleText='Are your employees wearing masks?'
                    />

                    <FilteredDataToPieChart
                        filteredData={this.state.restaurantSurveyResponses}
                        keyString='six-feet'
                        titleText='Are your tables 6 feet apart?'
                    />

                </Container>

            </div>
        );
    }

    populateStateWithJson = () => {
        let currState = this.state;
        currState.restaurantSurveyResponses = require('./data/mock_records.json');
        this.setState(currState);
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

