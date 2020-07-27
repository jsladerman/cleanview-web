import React, {Component} from 'react';
import styles from './css/AuthBoxes.module.css'
import {Redirect} from "react-router-dom";
import Auth from "@aws-amplify/auth"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from "react-bootstrap/Alert";


class ForgotPasswordResetBox extends Component {
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
                <p className={styles.headerText}>Reset Password</p>
                <Form onSubmit={this.resetPassword}>
                    <Form.Group controlId="code">
                        <Form.Label className={styles.formLabel}>Verification Code (sent to your email)</Form.Label>
                        <Form.Control
                            className={styles.formTextBox}
                            ref={val => this.verificationCodeVal = val}
                            name="verificationCode" type="text"/>
                    </Form.Group>
                    <Form.Group controlId="newPassword">
                        <Form.Label className={styles.formLabel}>New Password</Form.Label>
                        <Form.Control
                            className={styles.formTextBox}
                            ref={val => this.passwordVal = val}
                            name="signUpPassword" type="password"/>
                    </Form.Group>
                    <Form.Group controlId="confirmNewPassword">
                        <Form.Label className={styles.formLabel}>Confirm New Password</Form.Label>
                        <Form.Control
                            className={styles.formTextBox}
                            ref={val => this.confirmPasswordVal = val}
                            name="confirmPassword" type="password"/>
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
        if (this.verifyCorrectFormatting()){
            const email = this.props.email;
            const verificationCode = this.verificationCodeVal.value;
            const newPassword = this.passwordVal.value;
            Auth.forgotPasswordSubmit(email, verificationCode, newPassword)
                .then(() => {
                    this.props.changeFunc("login")
                })
                .catch((error) => this.setState({errorMessage: error.message}))
        }
    }

    verifyCorrectFormatting = () => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,128}$/;

        if (this.passwordVal.value !== this.confirmPasswordVal.value){
            this.setState({errorMessage: 'Password fields must be the same'})
            return false;
        }
        if (!passwordRegex.test(this.passwordVal.value)){
            this.setState({errorMessage: 'Minimum password length is 8, including uppercase, lowercase, and numbers'})
            return false;
        }

        return true;

    }

    displayError = () => {
        if (!this.state.errorMessage)
            return null;
        let message = this.state.errorMessage;
        if (message === 'Username cannot be empty')
            this.props.changeFunc("forgotPassword")
        return (
            <Alert variant='danger'>{message}</Alert>
        );
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

export default ForgotPasswordResetBox;
