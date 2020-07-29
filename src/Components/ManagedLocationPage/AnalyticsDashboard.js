import React, { Component } from 'react';
import BarChart from './AnalyticsWidgets/BarChart'
import BinaryPieChart from './AnalyticsWidgets/BinaryPieChart'
import SurveyResponseFrequencyChart from './AnalyticsWidgets/SurveyResponseFrequencyChart'

// Intrusctions from Evan:
// update state with data
// if data (> 10 responses), then show analytics
// 1) button to download .csv of restaurant responses
// 2) barplot showing average consumer rating
// 3) piechart for the rest of the questions (yes/no)

class AnalyticsDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            restaurantSurveyResponses: []
        }
    }

    render() {

        this.populateStateWithJson();

        return (
            <div id="anal_dash" style={{ paddingLeft: "20px" }}>
                <span>
                    <BarChart width={500}
                        height={400}
                        bar_width={.9}
                        titleText='How safe do your customers feel?'
                        titleSize='12px'
                        color='#30B3CA'
                        bottomAxisText='Customer Rating'
                        tickVals={[0, 1, 2, 3, 4, 5]}
                        leftAxis={true}
                    />
                    <BinaryPieChart
                        height={400}
                        width={400}
                        titleText='Are your employees wearing masks?'
                        titleSize='12px'
                        margin={30}
                        yesPct={.15}
                    />
                </span>
                <br />
                <span>
                    <SurveyResponseFrequencyChart
                        height={400}
                        width={400}
                        titleSize='12px'
                        color='#30B3CA'
                        titleText="Average # of Survey Responses by Time Period"
                    />
                    <BarChart width={500}
                        height={400}
                        bar_width={.9}
                        titleText='Customer Age Distribution'
                        titleSize='12px'
                        color='#30B3CA'
                        bottomAxisText='Age Group'
                        leftAxis={false}
                    />
                </span>
            </div>
        );
    }

    populateStateWithJson = () => {
        let currState = this.state;
        //currState.response = {JSON PLACEHOLDER};
        this.setState(currState);
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