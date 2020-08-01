import React, { Component } from 'react';
import BarChart from '../AnalyticsWidgets/BarChart';

class FilteredDataToQRBarChart extends Component{

    generateTargetData = () => {
        let sublocations = this.props.sublocations;
        let filteredData = this.props.filteredData;

        let targetData = [];
        const qrIndices = {};
        let qrCounts = [];
        
        for(var i = 0; i < sublocations.length; i++){
            targetData.push({
                value: sublocations[i].name,
                frequency: 0.0,
            })
            qrIndices[sublocations[i].id] = i;
            qrCounts.push(0);
        }
        
        for(var j = 0; j < filteredData.length; j++){
            let obj = filteredData[j];
            let qrID = obj['sublocId'];
            let index = qrIndices[qrID];
            qrCounts[index]++;
        }

        for(var k = 0; k < targetData.length; k++){
            targetData[k].frequency = (qrCounts[k] / filteredData.length);
        }
        return targetData;
            
    }

    render(){
        let targetData = this.generateTargetData();
        return(
            <div>
                <BarChart
                    titleText='QR Distribution'
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
        )
    }
}

export default FilteredDataToQRBarChart;
