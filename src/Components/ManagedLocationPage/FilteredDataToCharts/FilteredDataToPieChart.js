import React, { Component } from 'react';
import BinaryPieChart from '../AnalyticsWidgets/BinaryPieChart';

// Props:
//  keyString - what to index the PieChart by
//  titleText - what to title the chart
//  filteredData - data with applied filters
// Result:
//  BinaryPieChart with given title

class FilteredDataToPieChart extends Component{

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
                <BinaryPieChart
                    titleText={this.props.titleText}
                    titleSize='16px'
                    height={350}
                    width={350}
                    margin={50}
                    yesPct={yesPercent}
                    yesLabel={this.props.yesLabel}
                    noLabel={this.props.noLabel}
                />
            </div>
        )
    }
}

export default FilteredDataToPieChart;
