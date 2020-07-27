import React, {Component} from 'react';
import styles from './css/AuthBoxes.module.css'
import {Redirect} from "react-router-dom";
import Auth from "@aws-amplify/auth"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from "react-bootstrap/Alert";

class ForgotPasswordBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            errorMessage: null,
        };
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect}/>
        }
        return (
            <div className={styles.box}>
                <p className={styles.forgotPasswordMessage}>
                    Forgot your password? Enter your email below and we'll send you a reset code shortly</p>
                <Form onSubmit={this.logIn}>
                    <Form.Group controlId="code">
                        <Form.Label style={{fontWeight:'bold'}} className={styles.formLabel}>Email Address</Form.Label>
                        <Form.Control
                            className={styles.formTextBox}
                            ref={val => this.emailVal = val}
                            name="email" type="text"/>
                    </Form.Group>
                </Form>
                {this.displayError()}
                <Button onClick={this.resetPassword} style={submitBtn} type='submit' variant="primary">
                    Reset Password
                </Button><br/>
                <div className={styles.linkText}
                     onClick={() => this.props.changeFunc('login')}>
                    Go back to Login
                </div>
            </div>

        );
    }

    resetPassword = () => {
        this.props.setEmailFunc(this.emailVal.value);
        Auth.forgotPassword(this.emailVal.value)
            .then(() => this.props.changeFunc("forgotPasswordReset"))
            .catch((error) => this.setState({errorMessage: error.message}))
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

export default ForgotPasswordBox;
