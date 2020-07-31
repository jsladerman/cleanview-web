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
                <Row>
                    <Col>
                        Age groups
                    </Col>
                </Row>

                {/* Filter data by age group */}
                <Row>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.addSingleFilter(this.state.ageExcludeFilter, '0-17')} defaultChecked/>
                        <label for="input1"> 0-17 </label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.addSingleFilter(this.state.ageExcludeFilter, '18-25')} defaultChecked/>
                        <label for="input1"> 18-25 </label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.addSingleFilter(this.state.ageExcludeFilter, '26-35')} defaultChecked/>
                        <label for="input1"> 26-35 </label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.addSingleFilter(this.state.ageExcludeFilter, '36-45')} defaultChecked/>
                        <label for="input1"> 36-45 </label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.addSingleFilter(this.state.ageExcludeFilter, '46-55')} defaultChecked/>
                        <label for="input1"> 46-55 </label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.addSingleFilter(this.state.ageExcludeFilter, '56-65')} defaultChecked/>
                        <label for="input1"> 56-65 </label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="input1" onClick={() => this.addSingleFilter(this.state.ageExcludeFilter, '66+')} defaultChecked/>
                        <label for="input1"> 66+ </label>
                    </Col>
                </Row>

                <br />

                {/* Filter data by customer locale */}
                <Row>
                    <Col>Customer locality</Col>
                </Row>
                <Row>
                    <Col>
                        <input className={styles.check} type="checkbox" name="localCheckbox" onClick={() => this.addSingleFilter(this.state.touristExcludeFilter, '0')} defaultChecked/>
                        <label for="localCheckbox">Local customers</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="touristCheckbox" onClick={() => this.addSingleFilter(this.state.touristExcludeFilter, '1')} defaultChecked/>
                        <label for="touristCheckbox">Non-local customers</label>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                    <Col></Col>
                </Row>

                <br />

                {/* Filter data by weekday */}
                <Row>
                    <Col>Weekdays</Col>
                </Row>
                <Row>
                    <Col>
                        <input className={styles.check} type="checkbox" name="sunCheckbox" onClick={() => this.addSingleFilter(this.state.weekdayExcludeFilter, 'Sun')} defaultChecked/>
                        <label for="sunCheckbox">Sunday</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="monCheckbox" onClick={() => this.addSingleFilter(this.state.weekdayExcludeFilter, 'Mon')} defaultChecked/>
                        <label for="monCheckbox">Monday</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="tueCheckbox" onClick={() => this.addSingleFilter(this.state.weekdayExcludeFilter, 'Tue')} defaultChecked/>
                        <label for="tueCheckbox">Tuesday</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="wedCheckbox" onClick={() => this.addSingleFilter(this.state.weekdayExcludeFilter, 'Wed')} defaultChecked/>
                        <label for="wedCheckbox">Wednesday</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="thuCheckbox" onClick={() => this.addSingleFilter(this.state.weekdayExcludeFilter, 'Thu')} defaultChecked/>
                        <label for="thuCheckbox">Thursday</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="friCheckbox" onClick={() => this.addSingleFilter(this.state.weekdayExcludeFilter, 'Fri')} defaultChecked/>
                        <label for="friCheckbox">Friday</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="satCheckbox" onClick={() => this.addSingleFilter(this.state.weekdayExcludeFilter, 'Sat')} defaultChecked/>
                        <label for="satCheckbox">Saturday</label>
                    </Col>
                </Row>

                <br />

                {/* Filter data by hour */}
                <Row>
                    <Col>Hours</Col>
                </Row>
                <Row>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a0" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 0)} defaultChecked/>
                        <label for="a0">12 am</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a1" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 1)} defaultChecked/>
                        <label for="a1">1 am</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a2" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 2)} defaultChecked/>
                        <label for="a2">2 am</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a3" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 3)} defaultChecked/>
                        <label for="a3">3 am</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a4" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 4)} defaultChecked/>
                        <label for="a4">4 am</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a5" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 5)} defaultChecked/>
                        <label for="a5">5 am</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a6" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 6)} defaultChecked/>
                        <label for="a6">6 am</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a7" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 7)} defaultChecked/>
                        <label for="a7">7 am</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a8" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 8)} defaultChecked/>
                        <label for="a8">8 am</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a9" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 9)} defaultChecked/>
                        <label for="a9">9 am</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a10" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 10)} defaultChecked/>
                        <label for="a10">10 am</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a11" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 11)} defaultChecked/>
                        <label for="a11">11 am</label>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a12" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 12)} defaultChecked/>
                        <label for="a12">12 pm</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a13" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 13)} defaultChecked/>
                        <label for="a13">1 pm</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a14" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 14)} defaultChecked/>
                        <label for="a14">2 pm</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a15" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 15)} defaultChecked/>
                        <label for="a15">3 pm</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a16" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 16)} defaultChecked/>
                        <label for="a16">4 pm</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a17" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 17)} defaultChecked/>
                        <label for="a17">5 pm</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a18" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 18)} defaultChecked/>
                        <label for="a18">6 pm</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a19" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 19)} defaultChecked/>
                        <label for="a19">7 pm</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a20" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 20)} defaultChecked/>
                        <label for="a20">8 pm</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a21" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 21)} defaultChecked/>
                        <label for="a21">9 pm</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a22" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 22)} defaultChecked/>
                        <label for="a22">10 pm</label>
                    </Col>
                    <Col>
                        <input className={styles.check} type="checkbox" name="a23" onClick={() => this.addSingleFilter(this.state.hourExcludeFilter, 23)} defaultChecked/>
                        <label for="a23">11 pm</label>
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


