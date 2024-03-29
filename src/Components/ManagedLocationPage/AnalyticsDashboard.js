import React, {Component} from 'react';
import FilteredDataToPieChart from './FilteredDataToCharts/FilteredDataToPieChart';
import FilteredDataToAgeBarChart from './FilteredDataToCharts/FilteredDataToAgeBarChart';
import FilteredDataToRatingBarChart from './FilteredDataToCharts/FilteredDataToRatingBarChart';
import FilteredDataToFrequencyChart from './FilteredDataToCharts/FilteredDataToFrequencyChart';
import FilteredDataToQRBarChart from './FilteredDataToCharts/FilteredDataToQRBarChart';
import OverviewMetrics from './AnalyticsSubcomponents/OverviewMetrics';
import styles from './css/AnalyticsDashboard.module.css';
import {Formik, Form, Field} from 'formik';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Auth from '@aws-amplify/auth';
import API from '@aws-amplify/api';
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";

class AnalyticsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // All survey responses
            allResponses: [],

            // Filtering data for charts in "Survey Responses" section
            filteredData: [],
            ageExcludeFilter: [],
            touristExcludeFilter: [],
            weekdayExcludeFilter: [],
            hourExcludeFilter: [],
            qrExcludeFilter: [],
            dayRange: -1,   // dayRange < 1 = all-time data

            // Filtering data for charts in "Customer Demographic" section
            filteredDataForDemographicCharts: [],
            dayRangeForDemographicCharts: -1, // dayRange < 1 = all-time data

            rerenderCharts: false,
            retrievedData: false,
        }
    }

    // Props
    //  this.props.id               location_id
    //  this.props.sublocations     array of sublocations

    componentDidMount = () => {
        this.pullData();
    }

    render() {
        if (this.state.allResponses.length === 0) {
            if (this.state.retrievedData) {
                return (
                    <h2 className={styles.analDash} id={styles.analyticsHeader}>Not enough data to generate
                        analytics.</h2>
                )
            }
            return (
                <img
                    src={require("../../images/dashboardLoader.svg")}
                    alt=''
                    height='100%'
                    width='100%'
                />
            )
        }
        return (
            <div className={styles.analDash}>
                <h2 id={styles.analyticsHeader}>Analytics Dashboard</h2>

                <h4 className={styles.analyticsDashboardSubheader}>Overview</h4>
                <OverviewMetrics allData={this.state.allResponses}/> <br/>

                <h4 className={styles.analyticsDashboardSubheader}>Customer Demographic Information</h4>
                {this.renderFilteringWidgetForDemographicCharts()}
                {this.renderDemographicCharts()} <br/>

                <h4 className={styles.analyticsDashboardSubheader}>Survey Responses</h4>
                {this.renderFilteringWidget()} <br/>
                {this.renderFilteredOverview()}
                {this.renderFilteringCharts()}

            </div>
        );
    }

    /************************************************************************************************/
    /*                            Functions for rendering filtering widget                          */
    /************************************************************************************************/
    renderFilteringWidget = () => {
        return (
            <div className={styles.filterCharts}>
                <p className={styles.filteringWidgetHeader}>Filter Data</p>
                <Row><Col>
                    <Accordion>
                        <Accordion.Toggle as={Button}
                                          eventKey="0"
                                          style={{
                                              backgroundColor: '#23C9AD',
                                              borderWidth: '0',
                                              fontFamily: 'Roboto, serif',
                                              fontWeight: 'bold',
                                              marginLeft: '0px'
                                          }}>
                            Options
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Container fluid className={styles.filteringOptions}>
                                <Row><Col className={styles.filteringCategories}>Uncheck a box to exclude that group
                                    from the analysis below.<br/></Col></Row>
                                <Row>
                                    <Col>
                                        {/* DATE RANGES */}
                                        <p className={styles.filteringCategories}>Date Range</p>
                                        <Formik validate={(values) => this.filterDayRange(values.choice)}
                                                initialValues={{choice: this.state.dayRange}}>
                                            <Form>
                                                <Field as='select' name='choice'>
                                                    <option value={-1}>All-time</option>
                                                    <option value={1}>Last 24 hours</option>
                                                    <option value={7}>Last week</option>
                                                    <option value={30}>Last month</option>
                                                </Field>
                                            </Form>
                                        </Formik>

                                        {/* WEEKDAYS */}
                                        <p className={styles.filteringCategories}>Weekday</p>
                                        {this.renderSingleCheckbox("sundayCheck", "Sunday", this.state.weekdayExcludeFilter, 'Sun')}
                                        {this.renderSingleCheckbox("mondayCheck", "Monday", this.state.weekdayExcludeFilter, 'Mon')}
                                        {this.renderSingleCheckbox("tuesdayCheck", "Tuesday", this.state.weekdayExcludeFilter, 'Tue')}
                                        {this.renderSingleCheckbox("wednesdayCheck", "Wednesday", this.state.weekdayExcludeFilter, 'Wed')}
                                        {this.renderSingleCheckbox("thursdayCheck", "Thursday", this.state.weekdayExcludeFilter, 'Thu')}
                                        {this.renderSingleCheckbox("fridayCheck", "Friday", this.state.weekdayExcludeFilter, 'Fri')}
                                        {this.renderSingleCheckbox("saturdayCheck", "Saturday", this.state.weekdayExcludeFilter, 'Sat')}

                                        {/* CUSTOMER LOCALITY */}
                                        <p className={styles.filteringCategories}>Customer Living Distance</p>
                                        {this.renderSingleCheckbox("localCheck", "Local", this.state.touristExcludeFilter, '0')}
                                        {this.renderSingleCheckbox("touristCheckbox", "Non-local", this.state.touristExcludeFilter, '1')}
                                    </Col>
                                    <Col>
                                        {/* AGE GROUP */}
                                        <p className={styles.filteringCategories}>Age</p>
                                        {this.renderSingleCheckbox("input1", "13-17", this.state.ageExcludeFilter, '13-17')}
                                        {this.renderSingleCheckbox("input1", "18-25", this.state.ageExcludeFilter, '18-25')}
                                        {this.renderSingleCheckbox("input1", "26-35", this.state.ageExcludeFilter, '26-35')}
                                        {this.renderSingleCheckbox("input1", "36-45", this.state.ageExcludeFilter, '36-45')}
                                        {this.renderSingleCheckbox("input1", "46-55", this.state.ageExcludeFilter, '46-55')}
                                        {this.renderSingleCheckbox("input1", "56-65", this.state.ageExcludeFilter, '56-65')}
                                        {this.renderSingleCheckbox("input1", "66+", this.state.ageExcludeFilter, '66+')}

                                        {/* QR CODE */}
                                        {/* <p className={styles.filteringCategories}>QR Code</p>
                                        {this.renderQRCodeCheckboxes()} */}
                                    </Col>
                                    <Col>
                                        {/* HOURS */}
                                        <p className={styles.filteringCategories}>Hours</p>
                                        {this.renderHoursCheckboxes()}
                                    </Col>
                                </Row>
                            </Container>
                        </Accordion.Collapse>
                    </Accordion>
                </Col></Row>
            </div>
        )
    }

    renderQRCodeCheckboxes = () => {
        let qrCheckboxes = [];
        let sublocations = this.props.sublocations;
        for (var i = 0; i < sublocations.length; i++) {
            let name = sublocations[i].name;
            let id = sublocations[i].id;
            let checkbox = this.renderSingleCheckbox("qrCheckName", name, this.state.qrExcludeFilter, id);
            if(sublocations[i].active)
                qrCheckboxes.push(checkbox);
        }

        return qrCheckboxes;
    }

    renderHoursCheckboxes = () => {
        return (
            <Row>
                <Col>
                    {/* HOURS (1) */}
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
                </Col>
                <Col>
                    {/* HOURS (2) */}
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
                </Col>
            </Row>
        )
    }

    // Returns a checkbox wrapped in a Col that, when toggled, adds a filter to one of the filterArrays in state
    renderSingleCheckbox = (elementName, labelText, filterArray, filterValue) => {
        return (
            <div>
                <input
                    className={styles.check}
                    type="checkbox"
                    name={elementName}
                    onClick={() => this.addSingleFilter(filterArray, filterValue)} defaultChecked/>
                <label>{labelText}</label>
            </div>
        )
    }

    renderFilteringWidgetForDemographicCharts = () => {
        return (
            <div className={styles.filterDemographicCharts}>
                <div className={styles.filteringDemographicChartsWidgetHeader}>Filter Date Range</div>
                <div style={{ marginTop: '2px' }}>
                    <Formik validate={(values) => this.filterDayRangeDemographicCharts(values.choice)}
                        initialValues={{ choice: this.state.dayRangeForDemographicCharts }}>
                        <Form className={styles.filterTimeForDemographicCharts}>
                            <Field as='select' name='choice'>
                                <option value={-1}>All-time</option>
                                <option value={1}>Last 24 hours</option>
                                <option value={7}>Last week</option>
                                <option value={30}>Last month</option>
                            </Field>
                        </Form>
                    </Formik>
                </div>
            </div>
        )
    }

    renderFilteredOverview = () => {
        if (this.state.filteredData.length === 0) {
            return (<h5>No data meets the filtering criteria.</h5>)
        }
        return (
            <div className={styles.filteredOverview}>
                <h4>Statistics</h4>
                <Row>
                    <Col className={styles.filteredOverviewSubheader}>Average Response</Col>
                    <Col className={styles.cell}>{this.averageRating(this.state.filteredData)} / 5</Col>
                </Row>
                <Row>
                    <Col className={styles.filteredOverviewSubheader}>Number of responses</Col>
                    <Col className={styles.cell}>{this.state.filteredData.length}</Col>
                </Row>
            </div>
        );
    }

    /************************************************************************************************/
    /*                                 Functions for rendering charts                               */
    /************************************************************************************************/

    renderDemographicCharts = () => {
        if (this.state.filteredDataForDemographicCharts.length === 0) {
            return (<div>No data meets the filtering criteria.</div>)
        } else if (!this.state.rerenderCharts) {
            return (
                <div>
                <p style={{fontWeight:'bold', marginLeft:'10px', marginTop: '10px'}}>Number of responses: {this.state.filteredDataForDemographicCharts.length}</p>
                <div>
                    <Row className={styles.rowDivider}>
                        <Col>
                            <FilteredDataToAgeBarChart
                                filteredData={this.state.filteredDataForDemographicCharts}
                            />
                        </Col>

                        <Col>
                            <FilteredDataToPieChart
                                style={{margin: 'auto'}}
                                filteredData={this.state.filteredDataForDemographicCharts}
                                keyString='touristDiner'
                                titleText='Customer Living Distance'
                                yesLabel="live within 15 miles of the restaurant"
                                noLabel="do not live within 15 miles of the restaurant"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {/* <FilteredDataToQRBarChart
                                filteredData={this.state.filteredDataForDemographicCharts}
                                sublocations={this.props.sublocations.filter((sublocation) => sublocation.active)}
                            /> */}
                        </Col>
                    </Row>
                </div>
                </div>
            );
        }
        return (
            <img
                src={require("../../images/dashboardLoader.svg")}
                alt=''
                height='100%'
                width='100%'
            />
        )
    }

    renderFilteringCharts = () => {
        if (this.state.filteredData.length === 0) {
            // A message with "No data meets the filtering criteria." is displayed in renderFilteredOverview()
            return (<div></div>);
        } else if (!this.state.rerenderCharts) {
            return (
                <div>
                    <Row><Col><h4>Charts</h4></Col></Row>
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
                        <Col style={{marginLeft: '50px'}}>
                            <FilteredDataToPieChart
                                style={{margin: 'auto'}}
                                filteredData={this.state.filteredData}
                                keyString='employeeMasks'
                                titleText='Are Employees Wearing Masks?'
                                yesLabel="said yes"
                                noLabel="said no"
                            />
                        </Col>

                        <Col style={{marginLeft: '50px'}}>
                            <FilteredDataToPieChart
                                filteredData={this.state.filteredData}
                                keyString='sixFeet'
                                titleText='Are Parties 6 Feet Apart?'
                                yesLabel="said yes"
                                noLabel="said no"
                            />
                        </Col>
                    </Row>
                </div>
            );
        }
        return (
            <img
                src={require("../../images/dashboardLoader.svg")}
                alt=''
                height='100%'
                width='100%'
            />
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
    /*                  Functions for filtering charts in "Survey Responses" section                */
    /************************************************************************************************/

    filterData = async () => {
        this.setState({rerenderCharts: true});
        let newFilteredData = await this.state.allResponses.filter(response =>
            (!this.state.touristExcludeFilter.includes(response['touristDiner'])
                && !this.state.ageExcludeFilter.includes(response['age'])
                && !this.state.hourExcludeFilter.includes(parseFloat(response['timestamp'].slice(12, 14)))
                && !this.state.weekdayExcludeFilter.includes(response['weekday'])
                && (this.state.dayRange < 1 || this.daysFromToday(response['timestamp']) <= this.state.dayRange)
                && !this.state.qrExcludeFilter.includes(response['sublocId'])
            )
        )
        this.setState({filteredData: newFilteredData});
        this.setState({rerenderCharts: false});
    }

    addSingleFilter = (array, item) => {
        let newArray = array;
        if (newArray.includes(item)) {
            var index = newArray.indexOf(item);
            newArray.splice(index, 1);
        } else {
            newArray.push(item);
        }

        this.setState({array: newArray});
        this.filterData();
    }

    filterDayRange = async (newDayRange) => {
        await this.setState({dayRange: newDayRange});
        await this.filterData();
    }

    /************************************************************************************************/
    /*                           Functions for filtering demographic charts                         */
    /************************************************************************************************/
    filterDemographicData = async () => {
        this.setState({rerenderCharts: true});
        let newFilteredData = await this.state.allResponses.filter(response =>
            (this.state.dayRangeForDemographicCharts < 1
                || this.daysFromToday(response['timestamp']) <= this.state.dayRangeForDemographicCharts)
        );
        this.setState({filteredDataForDemographicCharts: newFilteredData});
        this.setState({rerenderCharts: false});
    }

    filterDayRangeDemographicCharts = async (newDayRange) => {
        await this.setState({dayRangeForDemographicCharts: newDayRange});
        await this.filterDemographicData();
    }

    /************************************************************************************************/
    /*                             Functions for calculating time window                            */
    /************************************************************************************************/
    daysFromToday = (dateString) => {
        let currDate = Date.now();
        let dateFromString = new Date(dateString);
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        let millisecondsApart = Math.abs(currDate - dateFromString);
        return millisecondsApart / millisecondsPerDay;
    }

    /************************************************************************************************/
    /*                                 Functions for making API call                                */
    /************************************************************************************************/

    pullData = () => {
        Auth.currentUserInfo()
            .then(user => {
                if (user === null)
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
                let filteredResponses = response['data'].filter(response =>
                    response['age'] !== undefined
                    && response['employeeMasks'] !== undefined
                    && response['sixFeet'] !== undefined
                    && response['touristDiner'] !== undefined
                )

                // TODO - remove all survey responses where age = '0-17' from the database
                for (var i = 0; i < filteredResponses.length; i++) {
                    if (filteredResponses[i].age === '0-17') {
                        filteredResponses[i].age = '13-17';
                    }
                }

                currState.allResponses = filteredResponses;
                currState.filteredData = filteredResponses;
                currState.filteredDataForDemographicCharts = filteredResponses;
                currState.retrievedData = true;
                this.setState(currState);
            })
            .catch(error => {
                console.log('Error: ' + error);
            })
    }
}

export default AnalyticsDashboard;


