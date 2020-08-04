import React, {Component} from 'react';
import styles from './css/ChangePasswordBox.module.css';
import {Field, Form, Formik} from "formik";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"

class ChangePasswordBox extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <div>
                    <Formik
                        initialValues={{
                            oldPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                        }}
                        onSubmit={this.onSubmit}>
                        <Form>
                            <label className={styles.formLabel}
                                   style={{marginLeft: '12px'}}>Old Password
                            </label>
                            <Field as={FormControl}
                                   className={styles.formInput} name='oldPassword'
                                   type='password'/>
                            <br/>
                            <label className={styles.formLabel}
                                   style={{marginLeft: '12px'}}>New Password
                            </label>
                            <Field as={FormControl}
                                   className={styles.formInput} name='newPassword'
                                   type='password'/>
                            <br/>
                            <label className={styles.formLabel}
                                   style={{marginLeft: '12px'}}>Confirm New Password
                            </label>
                            <Field as={FormControl}
                                   className={styles.formInput} name='confirmPassword'
                                   type='password'/>
                            <br/>
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
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,128}$/;

        if (values.newPassword !== values.confirmPassword) {
            this.props.errorFunc('Password fields must be the same')
        } else if (!passwordRegex.test(values.newPassword)) {
            this.props.errorFunc('Minimum password length is 8, including uppercase, lowercase, and numbers')
        } else {
            this.props.submitFunc(values);
        }
    }
}

export default ChangePasswordBox;
