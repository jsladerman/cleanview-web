import React, {Component} from 'react';
import styles from './css/Settings.module.css';
import {Field, Form, Formik} from "formik";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"

class SettingsBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settingsInfo: this.props.settingsInfo
        }
    }

    componentDidMount() {
        if (!this.state.settingsInfo) {
            this.setState({
                settingsInfo: {
                    firstName: '',
                    lastName: '',
                    phone: ''
                }
            })
        }
    }

    render() {
        if (!this.state.settingsInfo){
            return null;
        }
        return (
            <div>
                <div className={styles.body}>
                    <Formik
                        initialValues={{
                            firstName: this.state.settingsInfo.firstName,
                            lastName: this.state.settingsInfo.lastName,
                            phone: this.state.settingsInfo.phone
                        }}
                        // onSubmit={this.submitFunc}>
                        onSubmit={(val) => console.log(val)}>
                        <Form className={styles.form}>
                            <div className={styles.formCols}>
                                <div className={styles.formLabel}>First Name</div>
                                <Field className={styles.formInput} type='input' name='firstName'/>
                                <div className={styles.formLabel}>Last Name</div>
                                <Field className={styles.formInput} type='input' name='lastName'/>
                                <div className={styles.formLabel}>Phone Number</div>
                                <Field className={styles.formInput} type='input' name='phone'/>
                            </div>
                            <Button type='submit'>
                                Update
                            </Button>
                        </Form>
                    </Formik>
                </div>
            </div>

        );
    }
}

export default SettingsBox;
