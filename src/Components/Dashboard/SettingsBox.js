import React, {Component} from 'react';
import styles from './css/SettingsBox.module.css';
import {Field, Form, Formik} from "formik";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup"
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
        if (!this.state.settingsInfo) {
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
                        onSubmit={this.onSubmit}>
                        <Form>
                            <label className={styles.formLabel}
                                   style={{marginLeft: '12px'}}>First Name</label>
                            <label className={styles.formLabel}
                                   style={{marginLeft: '130px'}}>Last Name</label>
                            <InputGroup className="">
                                <Field as={FormControl} style={{width: '16px', marginRight: '20px'}}
                                       className={styles.formInputName} name='firstName'
                                       placeholder='John'/>
                                <Field as={FormControl} style={{width: '16px', marginRight: '20px'}}
                                       className={styles.formInputName} name='lastName'
                                       placeholder='Smith'/>
                            </InputGroup><br/>
                            <label className={styles.formLabel}
                                   style={{marginLeft: '12px'}}>Phone Number
                            </label>
                            <Field as={FormControl} style={{width: '405px', marginRight: '20px'}}
                                   className={styles.formInputName} name='phone'
                                   placeholder='800-555-1234'/><br/>
                            <Button type='submit' variant='info'
                                    className={styles.formSubmitBtn}>
                                Update
                            </Button>
                        </Form>
                    </Formik>
                </div>
            </div>
        );
    }

    onSubmit = (values) => {
        const phoneRegEx = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegEx.test(values.phone))
            alert("Phone number must be in this format: 800-555-1234");
        else {
            values.phone = this.parsePhoneNumber(values.phone)
            this.props.submitFunc(values);
        }
    }

    parsePhoneNumber = (phoneNumber) => {
        return phoneNumber.split('-').join('');
    }
}

export default SettingsBox;
