import React, { Component } from 'react';
import BarChart from '../AnalyticsWidgets/BarChart';

class FilteredDataToAgeBarChart extends Component{

    generateTargetData = () => {
        const targetData = [
            {
              value: "13-17",
              frequency: 0,
            },
            {
              value: "18-25",
              frequency: 0,
            },
            {
              value: "26-35",
              frequency: 0,
            },
            {
              value: "36-45",
              frequency: 0,
            },
            {
              value: "46-55",
              frequency: 0,
            },
            {
              value: "56-65",
              frequency: 0,
            },
            {
              value: "66+",
              frequency: 0,
            },
        ];

        let ageIndices = {
            "13-17": 0,
            "18-25": 1,
            "26-35": 2,
            "36-45": 3,
            "46-55": 4,
            "56-65": 5,
            "66+": 6,
        }

        let ageCounts = [0, 0, 0, 0, 0, 0, 0];
        let length = 0;
        for (var i = 0; i < this.props.filteredData.length; i++) {
            var obj = this.props.filteredData[i];
            var age = obj["age"]
            if(age !== undefined && ageIndices[age] !== undefined){
                let index = ageIndices[age];
                ageCounts[index]++;
                length++;
            }
        }

        for(i = 0; i < ageCounts.length; i++){
            targetData[i].frequency = (ageCounts[i] / length);
        }

        return targetData;
    }

    render() {
        let targetData = this.generateTargetData();
        return(
            <div>
                <BarChart
                    titleText='Customer Age Distribution'
                    titleSize='16px'
                    width={350}
                    height={350}
                    bar_width={.9}
                    color='#30B3CA'
                    bottomAxisText='Age Group'
                    leftAxis={true}
                    data={targetData}
                />
            </div>
        );
    }
}

export default FilteredDataToAgeBarChart;
