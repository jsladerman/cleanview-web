import React, { Component } from 'react';
import BarChart from '../AnalyticsWidgets/BarChart';

class FilteredDataToRatingBarChart extends Component{

    generateTargetData = () => {
        var targetData = [
            {
                value: 0,
                frequency: 0,
              },
              {
                value: 0.5,
                frequency: 0,
              },
              {
                value: 1,
                frequency: 0,
              },
              {
                value: 1.5,
                frequency: 0,
              },
              {
                value: 2,
                frequency: 0,
              },
              {
                value: 2.5,
                frequency: 0,
              },
              {
                value: 3,
                frequency: 0,
              },
              {
                value: 3.5,
                frequency: 0,
              },
              {
                value: 4,
                frequency: 0,
              },
              {
                value: 4.5,
                frequency: 0,
              },
              {
                value: 5,
                frequency: 0,
              },
        ]

        let ratingCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (var i = 0; i < this.props.filteredData.length; i++) {
            var obj = this.props.filteredData[i];
            var rating = parseFloat(obj["responseRating"])
            ratingCounts[2 * rating]++;
        }

        for(i = 0; i < ratingCounts.length; i++){
            targetData[i].frequency = (ratingCounts[i] / this.props.filteredData.length);
        }

        return targetData;
    }

    render(){
        let targetData = this.generateTargetData();
        return(
            <div>
                <BarChart
                    titleText='Customer Satisfaction'
                    titleSize='16px'
                    width={350}
                    height={350}
                    bar_width={.9}
                    color='#30B3CA'
                    bottomAxisText='Customer Satisfaction'
                    tickVals={[0, 1, 2, 3, 4, 5]}
                    leftAxis={true}
                    data={targetData}
                />
            </div>
        )    
    }
}

export default FilteredDataToRatingBarChart;
