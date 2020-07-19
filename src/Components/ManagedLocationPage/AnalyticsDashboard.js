import React, { Component } from 'react';

class AnalyticsDashboard extends Component {
    // update state with data
    
    // if data (> 10 responses), then show analytics
        // 1) button to download .csv of restaurant responses
        // 2) barplot showing average consumer rating
        // 3) piechart for the rest of the questions (yes/no)
    render() {
        return(
            <div id="anal_dash" style={{paddingLeft: "20px"}}>
                <h2>Analytics:</h2>
                <h4>Sorry, we need more data before we can perform analytics.</h4>
            </div>
        );
    }
}

export default AnalyticsDashboard;