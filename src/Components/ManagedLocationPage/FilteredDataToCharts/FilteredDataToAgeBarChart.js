import React, { Component } from 'react';
import BarChart from '../AnalyticsWidgets/BarChart';

class FilteredDataToAgeBarChart extends Component{
    constructor(props){
        super(props);
    }

    generateTargetData = () => {
        const targetData = [
            {
              value: "0-17",
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
            "0-17": 0,
            "18-25": 1,
            "26-35": 2,
            "36-45": 3,
            "46-55": 4,
            "56-65": 5,
            "66+": 6,
        }

        let ageCounts = [0, 0, 0, 0, 0, 0, 0];

        for (var i = 0; i < this.props.filteredData.length; i++) {
            var obj = this.props.filteredData[i];
            var age = obj["age"]
            var index = ageIndices[age];
            ageCounts[index]++;
        }

        for(i = 0; i < ageCounts.length; i++){
            targetData[i].frequency = (ageCounts[i] / this.props.filteredData.length);
        }

        return targetData;
    }

    render() {
        let targetData = this.generateTargetData();
        return(
            <div>
                <p>Customer Age Distribution</p>
                <BarChart
                    width={350}
                    height={350}
                    bar_width={.9}
                    // titleText='How safe do your customers feel?'
                    // titleSize='12px'
                    color='#30B3CA'
                    bottomAxisText='Age Group'
                    // tickVals={[0, 1, 2, 3, 4, 5]}
                    leftAxis={true}
                    data={targetData}
                />
            </div>
        );
    }
}

export default FilteredDataToAgeBarChart;
