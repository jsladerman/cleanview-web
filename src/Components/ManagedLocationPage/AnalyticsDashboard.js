import React, { Component } from 'react';
import FilteredDataToPieChart from './FilteredDataToCharts/FilteredDataToPieChart';
import FilteredDataToAgeBarChart from './FilteredDataToCharts/FilteredDataToAgeBarChart';
import FilteredDataToRatingBarChart from './FilteredDataToCharts/FilteredDataToRatingBarChart';
import FilteredDataToFrequencyChart from './FilteredDataToCharts/FilteredDataToFrequencyChart';
import styles from './css/AnalyticsDashboard.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Auth from '@aws-amplify/auth';
import API from '@aws-amplify/api';


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
        this.pullData();
        this.filterData();
    }

    render() {
        // TODO- ANOTHER WAY TO CHECK IF THE STATE HAS BEEN SET
        if (this.state.restaurantSurveyResponses.length === 0) {
            return (
                <div> LOADING </div>
            )
        }
        return (
            <div className={styles.analDash}>
                <h2 id={styles.analyticsHeader}>Analytics Dashboard</h2>

                <h4 className={styles.analyticsDashboardSubheader}>Overview</h4>
                <div className = {styles.overviewMetrics}>
                    <Row>
                        <Col></Col>
                        <Col>Rating</Col>
                        <Col>Responses</Col>
                    </Row>
                    <Row>
                        <Col>Today</Col>
                        <Col className={styles.cell1}>4.5</Col>
                        <Col className={styles.cell1}>128</Col>
                    </Row>
                    <Row>
                        <Col>This week</Col>
                        <Col className={styles.cell2}>4.2</Col>
                        <Col className={styles.cell2}>20</Col>
                    </Row>
                    <Row>
                        <Col>This month</Col>
                        <Col className={styles.cell3}>4.1</Col>
                        <Col className={styles.cell3}>85</Col>
                    </Row>
                </div>

                <br />

                <h4 className={styles.analyticsDashboardSubheader}>Customer Demographic Information</h4>
                <div>{this.renderDemographicCharts()}</div>
                
                <h4 className={styles.analyticsDashboardSubheader}>Survey Responses</h4>
                <Row className={styles.rowDivider}>
                    <Col id={styles.filterCharts}>
                        <p className={styles.analyticsDashboardSubheader2}>Filter Charts</p>
                        <p>Filter by age group</p>
                        <button onClick={() => this.filterSingleAgeGroup('0-17')}>0-17</button>
                        <button onClick={() => this.filterSingleAgeGroup('18-25')}>18-25</button>
                        <button onClick={() => this.filterSingleAgeGroup('26-35')}>26-35</button>
                        <button onClick={() => this.filterSingleAgeGroup('36-45')}>36-45</button>
                        <button onClick={() => this.filterSingleAgeGroup('46-55')}>46-55</button>
                        <button onClick={() => this.filterSingleAgeGroup('56-65')}>56-65</button>
                        <button onClick={() => this.filterSingleAgeGroup('66+')}>65+</button>

                        <p>Filter by customer locale</p>
                        <button onClick={() => this.filterSingleTouristGroup('1')}>Tourist customers</button>
                        <button onClick={() => this.filterSingleTouristGroup('0')}>Local customers</button>

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

            </div>
        );
    }

    renderDemographicCharts = () => {
        if (!this.state.rerenderCharts) {
            return (
                <Row className={styles.rowDivider}>
                    <Col>
                        <FilteredDataToAgeBarChart
                            filteredData={this.state.restaurantSurveyResponses}
                        />
                    </Col>

                    <Col>
                        <FilteredDataToPieChart
                            filteredData={this.state.restaurantSurveyResponses}
                            keyString='touristDiner'
                            titleText='Do your diners live within 15 miles of the restaurant?'
                            yesLabel="said yes"
                            noLabel="said no"
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
        if (!this.state.rerenderCharts) {
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
                                keyString='employeeMasks'
                                titleText='Are your employees wearing masks?'
                                yesLabel="said yes"
                                noLabel="said no"
                            />
                        </Col>

                        <Col>
                            <FilteredDataToPieChart
                                filteredData={this.state.filteredData}
                                keyString='sixFeet'
                                titleText='Are your tables at least 6 feet apart?'
                                yesLabel="said yes"
                                noLabel="said no"
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

    averageRating = (dataSet) => {
        let total = 0.0;
        for (var i = 0; i < dataSet.length; i++) {
            var obj = dataSet[i];
            total += parseFloat(obj['responseRating']);
        }
        return (total / dataSet.length).toFixed(1);
    }

    filterData = async () => {
        this.setState({ rerenderCharts: true });
        let newFilteredData = await this.state.restaurantSurveyResponses.filter(response =>
            (!this.state.touristExcludeFilter.includes(response['touristDiner']) && !this.state.ageExcludeFilter.includes(response['age']))
        );
        this.setState({ filteredData: newFilteredData });
        this.setState({ rerenderCharts: false });
    }


    // ageGroup is a string corresponding to an age group bucket, such as '0-17'
    filterSingleAgeGroup = (ageGroup) => {
        let newAgeExclude = this.state.ageExcludeFilter;

        if (newAgeExclude.includes(ageGroup)) {
            var index = newAgeExclude.indexOf(ageGroup);
            newAgeExclude.splice(index, 1);
        } else {
            newAgeExclude.push(ageGroup)
        }

        this.setState({ ageExcludeFilter: newAgeExclude });
        this.filterData();

        console.log(this.state.ageExcludeFilter);
    }

    // touristGroup is either '1' or '0'
    filterSingleTouristGroup = (touristGroup) => {
        let newTouristExclude = this.state.touristExcludeFilter;

        if (newTouristExclude.includes(touristGroup)) {
            var index = newTouristExclude.indexOf(touristGroup);
            newTouristExclude.splice(index, 1);
        } else {
            newTouristExclude.push(touristGroup)
        }

        this.setState({ touristExcludeFilter: newTouristExclude });
        this.filterData();

        console.log(this.state.touristExcludeFilter);
    }

    pullData = () => {
        Auth.currentUserInfo()
            .then(user => {
                if (user == null)
                    this.setState({ redirect: '/login' });
                else
                    this.getRestaurantSurveyData(this.props.id);
            })
            .catch(error => {
                console.log('Error: ' + error)
            });
    }

    getRestaurantSurveyData = (locationID) => {
        const apiName = 'GetSurveyResponses';
        const path = '/survey-responses/object'
        const myParams = {
            headers: {},
            response: true,
            queryStringParameters: {
                location_id: locationID
            },
        };

        API.get(apiName, path, myParams)
            .then(response => {
                let currState = this.state;
                currState.restaurantSurveyResponses = response['data'];
                currState.filteredData = response['data'];
                this.setState(currState);
                console.log(this.state.restaurantSurveyResponses);
            })
            .catch(error => {
                console.log('Error: ' + error);
            })
    }
}

export default AnalyticsDashboard;


