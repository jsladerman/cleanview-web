import React, { Component } from 'react';
import BinaryPieChart from '../AnalyticsWidgets/BinaryPieChart';

// Props:
//  keyString - what to index the PieChart by
//  titleText - what to title the chart
//  filteredData - data with applied filters
// Result:
//  BinaryPieChart with given title

class FilteredDataToPieChart extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let totalYes = 0;
        for (var i = 0; i < this.props.filteredData.length; i++) {
            var obj = this.props.filteredData[i];
            if (obj[this.props.keyString] === '1') {
                totalYes++;
            }
        }

        let yesPercent = totalYes / this.props.filteredData.length;

        return (
            <div>
                <p>{this.props.titleText}</p>
                <BinaryPieChart
                    height={250}
                    width={250}
                    // titleText={titleText}
                    // titleSize='12px'
                    margin={30}
                    yesPct={yesPercent}
                    yesLabel={this.props.yesLabel}
                    noLabel={this.props.noLabel}
                />
            </div>
        )
    }
}

export default FilteredDataToPieChart;
