import React, { Component } from 'react';
import FilteredDataToPieChart from './FilteredDataToCharts/FilteredDataToPieChart';
import FilteredDataToAgeBarChart from './FilteredDataToCharts/FilteredDataToAgeBarChart';
import FilteredDataToRatingBarChart from './FilteredDataToCharts/FilteredDataToRatingBarChart';
import FilteredDataToFrequencyChart from './FilteredDataToCharts/FilteredDataToFrequencyChart';
import OverviewMetrics from './AnalyticsSubcomponents/OverviewMetrics';
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
            demographicFilteredData: [],
            ageExcludeFilter: [],
            touristExcludeFilter: [],
            rerenderCharts: false,

            // QR filter
            // Timestamp filter- default is 0 hours = all data, else show from the past "x" hours
        }
    }

    componentDidMount = () => {
        this.pullData();
        let currState = this.state;
        currState.filteredData = this.state.restaurantSurveyResponses;
        this.setState(currState);
    }

    render() {
        if (this.state.restaurantSurveyResponses.length === 0) {
            return (
                <h2 className = {styles.analDash} id={styles.analyticsHeader}>Not enough data to generate analytics.</h2>
            )
        }
        return (
            <div className={styles.analDash}>
                <h2 id={styles.analyticsHeader}>Analytics Dashboard</h2>

                <h4 className={styles.analyticsDashboardSubheader}>Overview</h4>
                <OverviewMetrics
                    allData={this.state.restaurantSurveyResponses}
                />

                <br />

                <h4 className={styles.analyticsDashboardSubheader}>Customer Demographic Information</h4>
                <div>{this.renderDemographicCharts()}</div>

                <h4 className={styles.analyticsDashboardSubheader}>Survey Responses</h4>
                <Row className={styles.rowDivider}>
                    <Col id={styles.filterCharts}>
                        {this.renderFilteringWidget()}
                    </Col>
                </Row>
                <Row className={styles.rowDivider}>
                    <Col>
                        <p><span className={styles.fieldHeader}>Average Rating: </span> {this.averageRating(this.state.filteredData)} / 5</p>
                        <p><span className={styles.fieldHeader}>Total # of Reviews: </span> {this.state.filteredData.length} </p>
                    </Col>
                </Row>

                {this.renderFilteringCharts()}

            </div>
        );
    }

    renderFilteringWidget = () => {
        return (
            <div>
                <p className={styles.analyticsDashboardSubheader2}>Filter Data</p>
                <p>Filter the statistics and charts below by age, customer locale, shift, day, QR code </p>
                <Row>
                    <Col>
                        Select age groups to exclude.
                    </Col>
                </Row>

                {/* Filter data by age group */}
                <Row>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.filterSingleAgeGroup('0-17')} />
                        <label for="input1"> 0-17 </label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.filterSingleAgeGroup('18-25')} />
                        <label for="input1"> 18-25 </label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.filterSingleAgeGroup('26-35')} />
                        <label for="input1"> 26-35 </label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.filterSingleAgeGroup('36-45')} />
                        <label for="input1"> 36-45 </label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.filterSingleAgeGroup('46-55')} />
                        <label for="input1"> 46-55 </label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.filterSingleAgeGroup('56-65')} />
                        <label for="input1"> 56-65 </label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.filterSingleAgeGroup('66+')} />
                        <label for="input1"> 66+ </label>
                    </Col>
                </Row>

                <br />

                {/* Filter data by customer locale */}
                <Row>
                    <Col>Select customer locality to exclude.</Col>
                </Row>
                <Row>
                    <Col>
                        <input className={styles.check} type="checkbox" name="localCheckbox"/>
                        <label for="localCheckbox">Local customers</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="touristCheckbox"/>
                        <label for="touristCheckbox">Non-local customers</label>
                    </Col>
                </Row>
            </div>
        )
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
                            titleText='Do your customers live within 15 miles of the restaurant?'
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


