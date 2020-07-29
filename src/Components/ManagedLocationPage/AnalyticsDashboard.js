import React, { Component } from 'react';
import BarChart from './AnalyticsWidgets/BarChart'
import BinaryPieChart from './AnalyticsWidgets/BinaryPieChart'
import SurveyResponseFrequencyChart from './AnalyticsWidgets/SurveyResponseFrequencyChart'
import styles from './css/AnalyticsDashboard.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


class AnalyticsDashboard extends Component {
    // update state with data

    // if data (> 10 responses), then show analytics
    // 1) button to download .csv of restaurant responses
    // 2) barplot showing average consumer rating
    // 3) piechart for the rest of the questions (yes/no)
    render() {
        return (
            <div className={styles.analDash} style={{ paddingLeft: "20px" }}>
                <h2>Analytics Dashboard</h2>
                <p><span className={styles.fieldHeader}>Average Rating: </span> * * * * * (4.6)</p>
                <p><span className={styles.fieldHeader}>Total # of Reviews: </span>342</p>

                <br />

                <Container fluid>
                    <h4 className={styles.analyticsDashboardSubheader}>Customer Demographic Information</h4>
                    <Row>
                        {/* TODO
                    Put a grid of the Dashboards here (similar to ManagedLocationsInfo) */}
                        <Col>
                            <BarChart width={250}
                                height={250}
                                bar_width={.9}
                                titleText='How safe do your customers feel?'
                                titleSize='12px'
                                color='#30B3CA'
                                bottomAxisText='Customer Rating'
                                tickVals={[0, 1, 2, 3, 4, 5]}
                                leftAxis={true}
                            />
                        </Col>
                        <Col>
                            <SurveyResponseFrequencyChart
                                height={250}
                                width={250}
                                titleSize='12px'
                                color='#30B3CA'
                                titleText="Average # of Survey Responses by Time Period"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <BarChart width={250}
                                height={250}
                                bar_width={.9}
                                titleText='Customer Age Distribution'
                                titleSize='12px'
                                color='#30B3CA'
                                bottomAxisText='Age Group'
                                leftAxis={false}
                            />
                        </Col>
                    </Row>

                    <h4 className={styles.analyticsDashboardSubheader}>General Safety Response</h4>
                    <Row>
                        <Col>
                            <BinaryPieChart
                                height={250}
                                width={250}
                                titleText='Are your employees wearing masks?'
                                titleSize='12px'
                                margin={30}
                                yesPct={.15}
                            />
                        </Col>
                    </Row>

                </Container>
            </div>
        );
    }

    populateStateWithJson = () => {
        let currState = this.state;
        currState.restaurantSurveyResponses = require(data);
        this.setState(currState);
        console.log(this.state.restaurantSurveyResponses)
    }

    // Create functions that use this.state.restaurant_survey_responses and manipulate data

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
