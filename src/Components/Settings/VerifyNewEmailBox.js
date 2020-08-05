import React, {Component} from 'react';
import styles from './css/SettingsBoxes.module.css';
import {Field, Form, Formik} from "formik";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"
import Modal from "@trendmicro/react-modal";
import {Auth} from "aws-amplify";
import Alert from "react-bootstrap/Alert";

class VerifyNewEmailBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayMsg: false,
            msg: '',
            msgVariant: 'success'
        }
    }

    render() {
        return (
            <div className={styles.verifyEmailForm}>
                {this.renderVerifyMsg()}
                <Formik
                    initialValues={{
                        confirmationCode: ''
                    }}
                    onSubmit={this.onSubmit}>
                    <Form>
                        <label className={styles.formLabel}
                               style={{marginLeft: '12px', marginBottom: '16px'}}>Confirmation Code
                        </label>
                        <Field as={FormControl}
                               className={styles.formInput} name='confirmationCode'
                               type='input'/>
                        <br/>
                        <label className={styles.linkText}
                               onClick={this.resendEmail}
                               style={{marginLeft: '12px'}}>Resend Code
                        </label>
                        <Button type='submit' variant='success'
                                style={{marginTop: '-4px'}}
                                className={styles.verifyEmailSubmitBtn}>
                            Verify
                        </Button>
                    </Form>
                </Formik>
            </div>
        );
    }

    onSubmit = (params) => {
        this.setState({displayMsg: true})
        Auth.verifyCurrentUserAttributeSubmit('email', params.confirmationCode)
            .then(() => this.props.modalFunc())
            .catch(error => {
                this.setState({
                    displayMsg: true,
                    msg: error.message,
                    msgVariant: 'danger'
                });
            })
        this.props.authLoadFunc();
    }

    resendEmail = () => {
        Auth.verifyCurrentUserAttribute('email')
            .then(() => {
                this.setState({
                    displayMsg: true,
                    msg: 'New code sent, if it does not appear in your inbox check your spam as well.',
                    msgVariant: 'success'
                });
            })
            .catch(error => {
                this.setState({
                    displayMsg: true,
                    msg: 'Error sending new code, please try again later.',
                    msgVariant: 'danger'
                });
                console.log('ERROR ' + error.message)
            })
    }

    renderVerifyMsg = () => {
        if (this.state.displayMsg)
            return (
                <Alert variant={this.state.msgVariant} dismissible
                       onClose={() => this.setState({displayMsg: false})}
                       style={{whiteSpace: 'normal'}}>
                    <div>
                        {this.state.msg}
                    </div>
                </Alert>
            )
    }

}

export default VerifyNewEmailBox;
