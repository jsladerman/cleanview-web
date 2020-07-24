import React, { Component } from 'react';
import BarChart from './AnalyticsWidgets/BarChart'
import BinaryPieChart from './AnalyticsWidgets/BinaryPieChart'
import SurveyResponseFrequencyChart from './AnalyticsWidgets/SurveyResponseFrequencyChart'

class AnalyticsDashboard extends Component {
    // update state with data
    
    // if data (> 10 responses), then show analytics
        // 1) button to download .csv of restaurant responses
        // 2) barplot showing average consumer rating
        // 3) piechart for the rest of the questions (yes/no)
    render() {
        return(
            <div id="anal_dash" style={{paddingLeft: "20px"}}>
                <span>
                    <BarChart width={500} 
                        height={400} 
                        bar_width={.9} 
                        titleText='How safe do your customers feel?'
                        titleSize='12px' 
                        color='#30B3CA'
                        bottomAxisText='Customer Rating'
                        tickVals={[0,1,2,3,4,5]}
                        leftAxis={true}
                    />
                    <BinaryPieChart 
                        height={400}
                        width={400}
                        titleText='Are your employees wearing masks?'
                        titleSize='12px'
                        margin = {30}
                        yesPct = {.15}
                    />
                </span>
                <br />
                <span>
                    <SurveyResponseFrequencyChart
                        height = {400}
                        width = {400}
                        titleSize = '12px'
                        color = '#30B3CA'
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
}

export default AnalyticsDashboard;