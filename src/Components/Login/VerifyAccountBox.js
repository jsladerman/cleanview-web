import React, {Component} from 'react';
import styles from './css/VerifyAccountBox.module.css'
import {Redirect} from "react-router-dom";
import Auth from "@aws-amplify/auth"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from "react-bootstrap/Alert";


class VerifyAccountBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            errorMessage: null,
            newEmailSent: false
        };
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect}/>
        }
        return (
            <div className={styles.box}>
                <p className={styles.headerText}>Verify Account</p>
                <Form onSubmit={this.logIn}>
                    <Form.Group controlId="code">
                        <Form.Label className={styles.formLabel}>Verification Code</Form.Label>
                        <Form.Control
                            className={styles.formTextBox}
                            ref={val => this.verificationCode = val}
                            name="verificationCode" type="text"/>
                    </Form.Group>
                </Form>
                {this.displayError()}
                <Button onClick={this.verifyAccount} style={submitBtn} type='submit' variant="primary">
                    Verify Account
                </Button><br/>
                <div>
                    {this.resendEmailLink()}
                </div>
            </div>

        );
    }

    verifyAccount = () => {
        Auth.confirmSignUp(this.props.email, this.verificationCode.value)
            .then(() => this.props.changeFunc("login"))
            .catch((error) => this.setState({errorMessage: error.message}))
    }

    resendEmail = () => {
        Auth.resendSignUp(this.props.email)
            .then(() => this.setState({newEmailSent: true}))
            .catch((error) => this.setState({errorMessage: error.message}));
    }

    resendEmailLink = () => {
        if (this.state.newEmailSent) {
            return (
                <div className={styles.formLabel}>
                    New confirmation code sent. Make sure to check your spam folder if you do not receive it.
                </div>
            );
        }
        return (
            <div className={styles.linkText}
                 onClick={() => this.resendEmail()}>
                Resend email
            </div>
        );
    }

    displayError = () => {
        if (!this.state.errorMessage)
            return null;
        let message = this.state.errorMessage;
        if (message === 'Custom auth lambda trigger is not configured for the user pool.')
            message = 'Password is required'
        if (message === 'Username cannot be empty')
            message = 'Email address is required'
        return (
            <Alert variant='danger'>{message}</Alert>
        )
    }
}

const submitBtn = {
    backgroundColor: '#30B3CA',
    color: 'black',
    boxShadow: '0px 4px 11px -2px rgba(0,0,0,0.55)',
    fontWeight: 'bold',
    fontSize: '20px',
    justifyContent: 'center',
    marginTop: '16px',
    borderColor: 'transparent'
}

export default VerifyAccountBox;
