import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './css/OverviewMetrics.module.css';

class OverviewMetrics extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let data = this.props.data;

        return (
            <div>
                <div className={styles.subheader}>Average Customer Satisfaction</div>
                <div className={styles.ratingOverview}>
                    <Row>
                        <Col></Col>
                        <Col className="text-wrap">Average Response</Col>
                        <Col className="text-wrap"># of Responses</Col>
                    </Row>
                    <Row>
                        <Col>Today</Col>
                        <Col className={styles.cell1}>4.5</Col>
                        <Col className={styles.cell1}>128</Col>
                    </Row>
                    <Row>
                        <Col>This week</Col>
                        <Col className={styles.cell2}>4.2</Col>
                        <Col className={styles.cell2}>20</Col>
                    </Row>
                    <Row>
                        <Col>This month</Col>
                        <Col className={styles.cell3}>4.1</Col>
                        <Col className={styles.cell3}>85</Col>
                    </Row>
                </div>

                <div className={styles.subheader}>Strengths and Weaknesses</div>
                <Container fluid>
                   <div className={styles.subSubheader}>By Age</div>
                   <li className="text-wrap">
                       Age group <span className={styles.emphasis}>0-17</span> has the highest average satisfaction at <span className={styles.emphasis}>4.5</span>
                   </li>
                   <li className="text-wrap">
                       Age group <span className={styles.emphasis}>18-25</span> has the highest average satisfaction at <span className={styles.emphasis}>2.8</span>
                   </li>
                   
                   <br />
                   <div className={styles.subSubheader}>By Shift</div>
                   <li className="text-wrap">
                       Shift <span className={styles.emphasis}>Friday, 10am - 2pm</span> has the highest average satisfaction at <span className={styles.emphasis}>4.2</span>
                   </li>
                   <li className="text-wrap">
                       Shift <span className={styles.emphasis}>Tuesday, 2pm - 6pm</span> has the lowest average satisfaction at <span className={styles.emphasis}>2.1</span>
                   </li>
                </Container>

            </div>
        )
    }
}


export default OverviewMetrics;