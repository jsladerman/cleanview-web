import React, { Component } from 'react';
import SurveyResponseFrequencyChart from '../AnalyticsWidgets/SurveyResponseFrequencyChart';

class FilteredDataToFrequencyChart extends Component{
    constructor(props){
        super(props);
    }

    generateTargetData = () => {
        const targetData = [
            {
              label: "2am-6am",
              numResponses: 0,
            },
            {
              label: "6am-10am",
              numResponses: 0,
            },
            {
              label: "10am-2pm",
              numResponses: 0,
            },
            {
              label: "2pm-6pm",
              numResponses: 0,
            },
            {
              label: "6pm-10pm",
              numResponses: 0,
            },
            {
              label: "10pm-2am",
              numResponses: 0,
            },
          ];
          for (var i = 0; i < this.props.filteredData.length; i++) {
            var obj = this.props.filteredData[i];
            var timeHour = obj["timestamp"].slice(12, 14);  // Get the hour

            let index = -1;
            if(timeHour >= 2 && timeHour <= 5){             // 2 am to 5:59 am
                index = 0;   
            } else if(timeHour >= 6 && timeHour <= 9){      // 6 am to 9:59 am
                index = 1;
            } else if (timeHour >= 10 && timeHour <= 13){   // 10 am to 1:59 pm
                index = 2;
            } else if (timeHour >= 14 && timeHour <= 17){   // 2 pm to 5:59 pm
                index = 3;
            } else if (timeHour >= 18 && timeHour <= 21){   // 6 pm to 9:59 pm
                index = 4;
            } else if( (timeHour >= 22 && timeHour <= 23) || (timeHour >= 0 && timeHour <= 1)){     //10 pm to 1:59 am
                index = 5;
            }

            if(index >= 0){
                targetData[index].numResponses++;
            }
        }

        return targetData;
    }

    render(){
        let targetData = this.generateTargetData();
        return(
            <div>
              <div>Time of Survey Responses</div>
              <SurveyResponseFrequencyChart
              height={350}
              width={350}
              color='#30B3CA'
              // titleSize='12px'
              // titleText="Average # of Survey Responses by Time Period"
              data={targetData}
              />
            </div>
        )
    }

}

export default FilteredDataToFrequencyChart;
