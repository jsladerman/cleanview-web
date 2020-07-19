import React, {Component} from 'react';
import BarChart from './Components/ManagedLocationPage/BarChart';

class Testing extends Component {
    render () {
        return(
            <div>
                <h1>Bar chart</h1>
            <BarChart width={500} height={400} titleSize='12px' color={'blue'}/>
            </div>
        )
    }
}

export default Testing;