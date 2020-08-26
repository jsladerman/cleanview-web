import React, {Component} from 'react';
import styles from './css/Scheduler.module.css'
import {API} from 'aws-amplify';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Button from "react-bootstrap/Button";

class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div className={styles.schedulerWrapper}>
                <h2>Schedules</h2>
            </div>
        )
    }
}

export default Scheduler;
