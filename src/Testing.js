import React, {Component} from 'react';
import BarChart from './Components/ManagedLocationPage/BarChart';
import BinaryPieChart from './Components/ManagedLocationPage/BinaryPieChart';


class Testing extends Component {
    render () {
        return(
            <div>
            <h1>Bar chart</h1>
            <BarChart width={500} 
                height={400} 
                titleText='Customer Ratings (by %)'
                titleSize='12px' 
                color='#30B3CA'
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
            </div>
        )
    }
}

export default Testing;