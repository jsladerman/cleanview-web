import React, { Component } from 'react';
import FilteredDataToPieChart from './FilteredDataToCharts/FilteredDataToPieChart';
import FilteredDataToAgeBarChart from './FilteredDataToCharts/FilteredDataToAgeBarChart';
import FilteredDataToRatingBarChart from './FilteredDataToCharts/FilteredDataToRatingBarChart';
import FilteredDataToFrequencyChart from './FilteredDataToCharts/FilteredDataToFrequencyChart';
import OverviewMetrics from './AnalyticsSubcomponents/OverviewMetrics';
import styles from './css/AnalyticsDashboard.module.css';
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
            weekdayExcludeFilter: [],
            hourExcludeFilter: [],
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
                <h2 className={styles.analDash} id={styles.analyticsHeader}>Not enough data to generate analytics.</h2>
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
                
                <Row><Col>Age groups</Col></Row>

                {/* Filter data by age group */}
                <Row>
                    {this.renderSingleCheckbox("input1", "0-17", this.state.ageExcludeFilter, '0-17')}
                    {this.renderSingleCheckbox("input1", "18-25", this.state.ageExcludeFilter, '18-25')}
                    {this.renderSingleCheckbox("input1", "26-35", this.state.ageExcludeFilter, '26-35')}
                    {this.renderSingleCheckbox("input1", "36-45", this.state.ageExcludeFilter, '36-45')}
                    {this.renderSingleCheckbox("input1", "46-55", this.state.ageExcludeFilter, '46-55')}
                    {this.renderSingleCheckbox("input1", "56-65", this.state.ageExcludeFilter, '56-65')}
                    {this.renderSingleCheckbox("input1", "66+", this.state.ageExcludeFilter, '66+')}
                </Row> <br />

                {/* Filter data by customer locale */}
                <Row><Col>Customer locality</Col></Row>
                <Row>
                    {this.renderSingleCheckbox("localCheck", "Local customers", this.state.touristExcludeFilter, '0')}
                    {this.renderSingleCheckbox("touristCheckbox", "Non-local customers", this.state.touristExcludeFilter, '1')}
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                </Row> <br />

                {/* Filter data by weekday */}
                <Row><Col>Weekdays</Col></Row>
                <Row>
                    {this.renderSingleCheckbox("sundayCheck", "Sunday", this.state.weekdayExcludeFilter, 'Sun')}
                    {this.renderSingleCheckbox("mondayCheck", "Monday", this.state.weekdayExcludeFilter, 'Mon')}
                    {this.renderSingleCheckbox("tuesdayCheck", "Tuesday", this.state.weekdayExcludeFilter, 'Tue')}
                    {this.renderSingleCheckbox("wednesdayCheck", "Wednesday", this.state.weekdayExcludeFilter, 'Wed')}
                    {this.renderSingleCheckbox("thursdayCheck", "Thursday", this.state.weekdayExcludeFilter, 'Thu')}
                    {this.renderSingleCheckbox("fridayCheck", "Friday", this.state.weekdayExcludeFilter, 'Fri')}
                    {this.renderSingleCheckbox("saturdayCheck", "Saturday", this.state.weekdayExcludeFilter, 'Sat')}
                </Row> <br />

                {/* Filter data by hour */}
                <Row><Col>Hours</Col></Row>
                <Row>
                    {this.renderSingleCheckbox("a0", "12 am", this.state.hourExcludeFilter, 0)}
                    {this.renderSingleCheckbox("a1", "1 am", this.state.hourExcludeFilter, 1)}
                    {this.renderSingleCheckbox("a2", "2 am", this.state.hourExcludeFilter, 2)}
                    {this.renderSingleCheckbox("a3", "3 am", this.state.hourExcludeFilter, 3)}
                    {this.renderSingleCheckbox("a4", "4 am", this.state.hourExcludeFilter, 4)}
                    {this.renderSingleCheckbox("a5", "5 am", this.state.hourExcludeFilter, 5)}
                    {this.renderSingleCheckbox("a6", "6 am", this.state.hourExcludeFilter, 6)}
                    {this.renderSingleCheckbox("a7", "7 am", this.state.hourExcludeFilter, 7)}
                    {this.renderSingleCheckbox("a8", "8 am", this.state.hourExcludeFilter, 8)}
                    {this.renderSingleCheckbox("a9", "9 am", this.state.hourExcludeFilter, 9)}
                    {this.renderSingleCheckbox("a10", "10 am", this.state.hourExcludeFilter, 10)}
                    {this.renderSingleCheckbox("a11", "11 am", this.state.hourExcludeFilter, 11)}
                </Row>
                <Row>
                    {this.renderSingleCheckbox("a12", "12 pm", this.state.hourExcludeFilter, 12)}
                    {this.renderSingleCheckbox("a13", "1 pm", this.state.hourExcludeFilter, 13)}
                    {this.renderSingleCheckbox("a14", "2 pm", this.state.hourExcludeFilter, 14)}
                    {this.renderSingleCheckbox("a15", "3 pm", this.state.hourExcludeFilter, 15)}
                    {this.renderSingleCheckbox("a16", "4 pm", this.state.hourExcludeFilter, 16)}
                    {this.renderSingleCheckbox("a17", "5 pm", this.state.hourExcludeFilter, 17)}
                    {this.renderSingleCheckbox("a18", "6 pm", this.state.hourExcludeFilter, 18)}
                    {this.renderSingleCheckbox("a19", "7 pm", this.state.hourExcludeFilter, 19)}
                    {this.renderSingleCheckbox("a20", "8 pm", this.state.hourExcludeFilter, 20)}
                    {this.renderSingleCheckbox("a21", "9 pm", this.state.hourExcludeFilter, 21)}
                    {this.renderSingleCheckbox("a22", "10 pm", this.state.hourExcludeFilter, 22)}
                    {this.renderSingleCheckbox("a23", "11 pm", this.state.hourExcludeFilter, 23)}
                </Row>

            </div>
        )
    }

    // Returns a checkbox that, when toggled, adds a filter to one of the filterArrays in state
    renderSingleCheckbox = (elementName, labelText, filterArray, filterValue) => {
        return(
            <Col>
                <input 
                    className={styles.check}
                    type="checkbox"
                    name={elementName}
                    onClick={() => this.addSingleFilter(filterArray, filterValue)} defaultChecked/>
                <label for={elementName}>
                    {labelText}
                </label>
            </Col>
        )
    }

    /************************************************************************************************/
    /*                                 Functions for rendering charts                               */
    /************************************************************************************************/

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

    /************************************************************************************************/
    /*                             Average responseRating from a dataSet                            */
    /************************************************************************************************/

    averageRating = (dataSet) => {
        let total = 0.0;
        for (var i = 0; i < dataSet.length; i++) {
            var obj = dataSet[i];
            total += parseFloat(obj['responseRating']);
        }
        return (total / dataSet.length).toFixed(1);
    }

    /************************************************************************************************/
    /*                                    Functions for filtering                                   */
    /************************************************************************************************/

    filterData = async () => {
        this.setState({ rerenderCharts: true });
        let newFilteredData = await this.state.restaurantSurveyResponses.filter(response =>
            (!this.state.touristExcludeFilter.includes(response['touristDiner'])
                && !this.state.ageExcludeFilter.includes(response['age'])
                && !this.state.hourExcludeFilter.includes(parseFloat(response['timestamp'].slice(12, 14)))
                && !this.state.weekdayExcludeFilter.includes(response['weekday'])
            )
        );
        this.setState({ filteredData: newFilteredData });
        this.setState({ rerenderCharts: false });
    }

    addSingleFilter = (array, item) => {
        console.log(array);
        console.log(item);

        let newArray = array;
        if (newArray.includes(item)) {
            var index = newArray.indexOf(item);
            newArray.splice(index, 1);
        } else {
            newArray.push(item);
        }

        this.setState({ array: newArray });
        this.filterData();
        console.log(array);
    }

    /************************************************************************************************/
    /*                                 Functions for making API call                                */
    /************************************************************************************************/

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


