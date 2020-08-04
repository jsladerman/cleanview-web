import React, {Component} from 'react';
import styles from '../Settings/css/SettingsBoxes.module.css';
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
        if (!this.state.settingsInfo) {
            return null;
        }
        const phone = this.state.settingsInfo.phone;
        let formattedPhoneNum = '';
        if (this.state.settingsInfo.phone)
            formattedPhoneNum = phone.substr(0, 3) + '-'
                + phone.substr(3, 3)
                + '-' + phone.substr(6, 4);
        return (
            <div>
                <div>
                    <Formik
                        initialValues={{
                            firstName: this.state.settingsInfo.firstName,
                            lastName: this.state.settingsInfo.lastName,
                            phone: formattedPhoneNum
                        }}
                        onSubmit={this.onSubmit}>
                        <Form>
                            <div className={styles.formLabelInputGroup}
                                 style={{marginRight: '20px'}}>
                                <label className={styles.formLabel}
                                       style={{marginLeft: '12px'}}>First Name</label>
                                <Field as={FormControl}
                                       className={styles.formInputName} name='firstName'
                                       placeholder='John'/>
                            </div>
                            <div className={styles.formLabelInputGroup}>
                                <label className={styles.formLabel}
                                       style={{marginLeft: '12px'}}>Last Name</label>
                                <Field as={FormControl}
                                       className={styles.formInputName} name='lastName'
                                       placeholder='Smith'/>
                            </div>
                            <br/><br/>
                            <label className={styles.formLabel}
                                   style={{marginLeft: '12px'}}>Phone Number
                            </label>
                            <Field as={FormControl}
                                   className={styles.formInputPhone} name='phone'
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
            this.props.errorFunc()
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
