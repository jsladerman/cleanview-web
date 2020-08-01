import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './css/OverviewMetrics.module.css';

class OverviewMetrics extends Component {
    // Props
    //  data - all of the survey responses

    render() {
        let dayAverage = this.averageRatingByDays(1);
        let weekAverage = this.averageRatingByDays(7);
        let monthAverage = this.averageRatingByDays(30);

        let ageGroupStats = this.ageGroupAverage();
        let bestAgeGroup = ageGroupStats.bestAgeGroup.ageGroup;
        let bestAgeGroupRating = ageGroupStats.bestAgeGroup.average;
        let worstAgeGroup = ageGroupStats.worstAgeGroup.ageGroup;
        let worstAgeGroupRating = ageGroupStats.worstAgeGroup.average;

        let shiftStats = this.shiftAverage();
        let maxShiftRating = shiftStats.maxRating;
        let maxShift = shiftStats.maxShift;
        let minShiftRating = shiftStats.minRating;
        let minShift = shiftStats.minShift;

        return (
            <div>
                <Container>
                    <Row>
                        {/* Average Customer Satisfaction */}
                        <div className="col-md-5" style={{paddingLeft: '5px'}}>
                            <div className={styles.subheader}>Average Customer Satisfaction</div>
                            <div className={styles.ratingOverview}>
                                <Container>
                                    <Row>
                                        <div className="col-md-3"></div>
                                        <Col className={styles.ratingHeader}>Average <br /> Response</Col>
                                        <Col className={styles.ratingHeader}>Number of <br /> Responses</Col>
                                    </Row>
                                    <Row>
                                        <div className="col-md-3"><br />24 hours</div>
                                        <Col className={styles.cell1} >{dayAverage.average} / 5</Col>
                                        <Col className={styles.cell1}>{dayAverage.numResponses}</Col>
                                    </Row>
                                    <Row>
                                        <div className="col-md-3"><br />Week</div>
                                        <Col className={styles.cell2}>{weekAverage.average} / 5</Col>
                                        <Col className={styles.cell2}>{weekAverage.numResponses}</Col>
                                    </Row>
                                    <Row>
                                        <div className="col-md-3"><br />Month</div>
                                        <Col className={styles.cell3}>{monthAverage.average} / 5</Col>
                                        <Col className={styles.cell3}>{monthAverage.numResponses}</Col>
                                    </Row>
                                </Container>
                            </div>
                        </div>

                        {/* Strengths and Weaknesses */}
                        <Col>
                            <div className={styles.subheader}>Strengths and Weaknesses</div>
                            <Container fluid>
                                <div className={styles.subSubheader}>By Age</div>
                                <li className="text-wrap">
                                    Age group <span className={styles.emphasis}>{bestAgeGroup}</span> has the highest average satisfaction at <span className={styles.emphasis}>{bestAgeGroupRating}</span>
                                </li>
                                <li className="text-wrap">
                                    Age group <span className={styles.emphasisBad}>{worstAgeGroup}</span> has the lowest average satisfaction at <span className={styles.emphasisBad}>{worstAgeGroupRating}</span>
                                </li>

                                <br />
                                <div className={styles.subSubheader}>By Shift</div>
                                <li className="text-wrap">
                                    Shift <span className={styles.emphasis}>{maxShift}</span> has the highest average satisfaction at <span className={styles.emphasis}>{maxShiftRating}</span>
                                </li>
                                <li className="text-wrap">
                                    Shift <span className={styles.emphasisBad}>{minShift}</span> has the lowest average satisfaction at <span className={styles.emphasisBad}>{minShiftRating}</span>
                                </li>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

    /***********************************************************************/
    /*             Functions to populate rating overview                   */
    /***********************************************************************/

    // Computes the average customer satisfaction within a give number of days.
    //      if dayRange < 1, all the data is used
    //      returns a map with the "average" and "numResponses"
    averageRatingByDays = (dayRange) => {
        let length = 0;
        let total = 0.0;

        for (var i = 0; i < this.props.allData.length; i++) {
            var obj = this.props.allData[i];
            let dateString = obj['timestamp'];
            let daysAgo = this.daysFromToday(dateString);
            if (daysAgo <= dayRange) {
                total += parseFloat(obj['responseRating']);
                length++;
            }
        }

        let result = {
            average: (total / length).toFixed(1),
            numResponses: length,
        }
        return result;
    }

    // Computes the number of days between dateString and the current date
    // dateString is in format: Jul 19 2020 08:11:22
    daysFromToday = (dateString) => {
        let currDate = Date.now();
        let dateFromString = new Date(dateString);
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        let millisecondsApart = Math.abs(currDate - dateFromString);
        return millisecondsApart / millisecondsPerDay;
    }

    /***********************************************************************/
    /*             Functions to populate strengths and weaknesses          */
    /***********************************************************************/

    // Gets the age groups with the maximum and minimum average ratings
    ageGroupAverage = () => {
        let data = this.props.allData;

        let ageGroupData = [
            {
                ageGroup: '0-17',
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
            {
                ageGroup: '18-25',
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
            {
                ageGroup: '26-35',
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
            {
                ageGroup: '36-45',
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
            {
                ageGroup: '46-55',
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
            {
                ageGroup: '56-65',
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
            {
                ageGroup: '66+',
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
        ]

        let ageIndices = {
            "0-17": 0,
            "18-25": 1,
            "26-35": 2,
            "36-45": 3,
            "46-55": 4,
            "56-65": 5,
            "66+": 6,
        }

        for (var i = 0; i < data.length; i++) {
            let obj = data[i];
            let age = obj['age'];
            let rating = parseFloat(obj['responseRating']);
            ageGroupData[ageIndices[age]].totalRating += rating;
            ageGroupData[ageIndices[age]].numResponses++;
        }

        let maxIndex = 0;
        let minIndex = 0;

        // TO-DO: test this on a data set where the age group doesn't exist
        for (var j = 0; j < ageGroupData.length; j++) {
            if (ageGroupData[j].numResponses > 0) {
                let average = ageGroupData[j].totalRating / ageGroupData[j].numResponses;
                ageGroupData[j].average = average.toFixed(1);

                if (average >= ageGroupData[maxIndex].average) {
                    maxIndex = j;
                }
                if (ageGroupData[minIndex].average === -1 || average <= ageGroupData[minIndex].average) {
                    minIndex = j;
                }
            }
        }

        let result = {
            bestAgeGroup: ageGroupData[maxIndex],
            worstAgeGroup: ageGroupData[minIndex],
        }
        return result;
    }

    // Sort data into buckets for each weekday
    partitionDataByWeekday = () => {
        let data = this.props.allData;

        let dataByDay = {
            "Sun": [],
            "Mon": [],
            "Tue": [],
            "Wed": [],
            "Thu": [],
            "Fri": [],
            "Sat": [],
        }

        for (var i = 0; i < data.length; i++) {
            let obj = data[i];
            let day = obj['weekday'];
            dataByDay[day].push(obj);
        }

        return dataByDay;
    }

    // Gets the maximum and minimum shift for a given weekday
    getDayMaxAndMin = (dataFromSingleWeekday) => {
        let shiftAverages = [
            {
                shift: "2am-6am",
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
            {
                shift: "6am-10am",
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
            {
                shift: "10am-2pm",
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
            {
                shift: "2pm-6pm",
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
            {
                shift: "6pm-10pm",
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
            {
                shift: "10pm-2am",
                totalRating: 0,
                numResponses: 0,
                average: -1,
            },
        ]

        for (var i = 0; i < dataFromSingleWeekday.length; i++) {
            let obj = dataFromSingleWeekday[i];
            let timeHour = obj['timestamp'].slice(12, 14);
            let timeBucket = this.getTimeBucket(timeHour);
            shiftAverages[timeBucket].totalRating += parseFloat(obj['responseRating']);
            shiftAverages[timeBucket].numResponses++;
        }

        let maxIndex = 0;
        let minIndex = 0;

        for (var j = 0; j < shiftAverages.length; j++) {
            if (shiftAverages[j].numResponses > 0) {
                let average = shiftAverages[j].totalRating / shiftAverages[j].numResponses;
                shiftAverages[j].average = average.toFixed(1);

                if (average >= shiftAverages[maxIndex].average) {
                    maxIndex = j;
                }
                if (shiftAverages[minIndex].average === -1 || average <= shiftAverages[minIndex].average) {
                    minIndex = j;
                }
            }
        }

        let result = {
            bestShift: shiftAverages[maxIndex],
            worstShift: shiftAverages[minIndex],
        }
        return result;
    }

    // Enumerates an hour to a time bucket 0 - 6
    getTimeBucket = (timeHour) => {
        // Time buckets:
        // 0    2 am - 6 am
        // 1    6 am - 10 am
        // 2    10 am - 2 pm
        // 3    2 pm - 6 pm
        // 4    6 pm - 10 pm
        // 5    10 pm - 2 am
        // -1   error

        let index = -1;
        if (timeHour >= 2 && timeHour <= 5) {             // 2 am to 5:59 am
            index = 0;
        } else if (timeHour >= 6 && timeHour <= 9) {      // 6 am to 9:59 am
            index = 1;
        } else if (timeHour >= 10 && timeHour <= 13) {   // 10 am to 1:59 pm
            index = 2;
        } else if (timeHour >= 14 && timeHour <= 17) {   // 2 pm to 5:59 pm
            index = 3;
        } else if (timeHour >= 18 && timeHour <= 21) {   // 6 pm to 9:59 pm
            index = 4;
        } else if ((timeHour >= 22 && timeHour <= 23) || (timeHour >= 0 && timeHour <= 1)) {     //10 pm to 1:59 am
            index = 5;
        }

        return index;

    }

    // Returns the best and worst ratings across all shift / weekday combinations
    shiftAverage = () => {
        let minRating = -1;
        let maxRating = -1;
        let minShift = '';
        let maxShift = '';

        let keys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        let dataByWeekday = this.partitionDataByWeekday();
        for (var i = 0; i < keys.length; i++) {
            let key = keys[i];
            let dayMaxAndMin = this.getDayMaxAndMin(dataByWeekday[key]);
            let dayMaxRating = dayMaxAndMin.bestShift.average;
            let dayMaxShift = key + ", " + dayMaxAndMin.bestShift.shift;
            let dayMinRating = dayMaxAndMin.worstShift.average;
            let dayMinShift = key + ", " + dayMaxAndMin.worstShift.shift;

            if (dayMaxRating > maxRating) {
                maxRating = dayMaxRating;
                maxShift = dayMaxShift;
            }
            if (dayMinRating < minRating || minRating === -1) {
                minRating = dayMinRating;
                minShift = dayMinShift;
            }
        }

        if (minRating === -1) {
            minRating = maxRating;
            minShift = maxShift;
        }

        let result = {
            maxRating: maxRating,
            minRating: minRating,
            maxShift: maxShift,
            minShift: minShift,
        }
        return result;
    }

}


export default OverviewMetrics;