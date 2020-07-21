import React, {Component} from 'react';
import BarChart from './Components/ManagedLocationPage/DashboardWidgets/BarChart';
import BinaryPieChart from './Components/ManagedLocationPage/DashboardWidgets/BinaryPieChart';
import SurveyResponseFrequencyChart from './Components/ManagedLocationPage/DashboardWidgets/SurveyResponseFrequencyChart'


class Testing extends Component {
    render () {
        return(
            <div>
                <h1>Bar chart</h1>
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
                <h2>Pie Chart</h2>
                <BinaryPieChart 
                    height={400}
                    width={400}
                    titleText='Are your employees wearing masks?'
                    titleSize='12px'
                    margin = {30}
                    yesPct = {.15}
                />
                <h2>Bar Chart #2</h2>
                <SurveyResponseFrequencyChart
                    height = {400}
                    width = {400}
                    titleSize = '12px'
                    color = '#30B3CA'
                    titleText="Average # of Survey Responses by Time Period"
                />
                <h2>Bar Chart #3</h2>
                <BarChart width={500} 
                    height={400}
                    bar_width={.9} 
                    titleText='Customer Age Distribution'
                    titleSize='12px' 
                    color='#30B3CA'
                    bottomAxisText='Age Group'
                    leftAxis={false}
                />
            </div>

            
        )
    }
}

export default Testing;