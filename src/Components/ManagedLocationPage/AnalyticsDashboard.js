import React, { Component } from 'react';
import FilteredDataToPieChart from './FilteredDataToCharts/FilteredDataToPieChart';
import FilteredDataToAgeBarChart from './FilteredDataToCharts/FilteredDataToAgeBarChart';
import FilteredDataToRatingBarChart from './FilteredDataToCharts/FilteredDataToRatingBarChart';
import FilteredDataToFrequencyChart from './FilteredDataToCharts/FilteredDataToFrequencyChart';
import styles from './css/AnalyticsDashboard.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Checkbox from 'react-bootstrap/Checkbox';

class AnalyticsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurantSurveyResponses: [],
            filteredData: [],
            ageExcludeFilter: [],
            touristExcludeFilter: [],
            rerenderCharts: false,

            // QR filter
            // Timestamp filter- default is 0 hours = all data, else show from the past "x" hours
        }
    }

    componentDidMount = () => {
        this.populateStateWithJson();
        this.filterData();
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
                <p><span className={styles.fieldHeader}>Average Rating: </span> {this.averageRating(this.state.restaurantSurveyResponses)} / 5</p>
                <p><span className={styles.fieldHeader}>Total # of Reviews: </span> {this.state.restaurantSurveyResponses.length} </p>

                <br />

                <Container fluid>
                    <h4 className={styles.analyticsDashboardSubheader}>Customer Demographic Information</h4>
                    {this.renderDemographicCharts()}

                    <h4 className={styles.analyticsDashboardSubheader}>Survey Responses</h4>
                    <Row id={styles.filterCharts} className={styles.rowDivider}>
                        <Col>
                            <p className={styles.analyticsDashboardSubheader2}>Filter Charts</p>
                            <p>Filter by age group</p>
                            <button onClick = {() => this.filterSingleAgeGroup('0-17')}>0-17</button>
                            <button onClick = {() => this.filterSingleAgeGroup('18-25')}>18-25</button>
                            <button onClick = {() => this.filterSingleAgeGroup('26-35')}>26-35</button>
                            <button onClick = {() => this.filterSingleAgeGroup('36-45')}>36-45</button>
                            <button onClick = {() => this.filterSingleAgeGroup('46-55')}>46-55</button>
                            <button onClick = {() => this.filterSingleAgeGroup('56-65')}>56-65</button>
                            <button onClick = {() => this.filterSingleAgeGroup('66+')}>65+</button>

                            <p>Filter by customer locale</p>
                            <button onClick = {() => this.filterSingleTouristGroup('1')}>Tourist customers</button>
                            <button onClick = {() => this.filterSingleTouristGroup('0')}>Local customers</button>

                        </Col>
                    </Row>
                    <Row className={styles.rowDivider}>
                        <Col>
                            <p className={styles.analyticsDashboardSubheader2}>Filtered Statistics</p>
                            <p><span className={styles.fieldHeader}>Average Rating: </span> {this.averageRating(this.state.filteredData)} / 5</p>
                            <p><span className={styles.fieldHeader}>Total # of Reviews: </span> {this.state.filteredData.length} </p>
                        </Col>
                    </Row>
                    {this.renderFilteringCharts()}

                </Container>
            </div>
        );
    }

    renderDemographicCharts = () => {
        if(!this.state.rerenderCharts){
            return(
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
            );
        }
        return (
            <div>LOADING</div>
        )
    }

    renderFilteringCharts = () => {
        if(!this.state.rerenderCharts){
            return (
                <div>
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
                </div>
            );
        }
        return (
            <div>LOADING</div>
        )
    }

    populateStateWithJson = () => {
        let currState = this.state;
        currState.restaurantSurveyResponses = require('./data/mock_records.json');
        currState.filteredData = currState.restaurantSurveyResponses;
        this.setState(currState);
    }

    averageRating = (dataSet) => {
        let total = 0.0;
        for (var i = 0; i < dataSet.length; i++) {
            var obj = dataSet[i];
            total += parseFloat(obj['response-rating']);
        }
        return total / dataSet.length;
    }

    filterData = async () => {
        this.setState({rerenderCharts: true});
        let newFilteredData = await this.state.restaurantSurveyResponses.filter(response =>
            (!this.state.touristExcludeFilter.includes(response['tourist-diner']) && !this.state.ageExcludeFilter.includes(response['age']) )
        );
        this.setState({filteredData: newFilteredData});
        this.setState({rerenderCharts: false});
    }


    // ageGroup is a string corresponding to an age group bucket, such as '0-17'
    filterSingleAgeGroup = (ageGroup) => {
        let newAgeExclude = this.state.ageExcludeFilter;

        if(newAgeExclude.includes(ageGroup)){
            var index = newAgeExclude.indexOf(ageGroup);
            newAgeExclude.splice(index, 1);
        } else {
            newAgeExclude.push(ageGroup)
        }

        this.setState({ageExcludeFilter: newAgeExclude});
        this.filterData();

        console.log(this.state.ageExcludeFilter);
    }

    // touristGroup is either '1' or '0'
    filterSingleTouristGroup = (touristGroup) => {
        let newTouristExclude = this.state.touristExcludeFilter;

        if(newTouristExclude.includes(touristGroup)){
            var index = newTouristExclude.indexOf(touristGroup);
            newTouristExclude.splice(index, 1);
        } else {
            newTouristExclude.push(touristGroup)
        }

        this.setState({touristExcludeFilter: newTouristExclude});
        this.filterData();

        console.log(this.state.touristExcludeFilter);
    }

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

