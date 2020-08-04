import React, {Component} from 'react';
import styles from './css/AuthBoxes.module.css'
import {Redirect} from "react-router-dom";
import Auth from "@aws-amplify/auth"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from "react-bootstrap/Alert";


class SignUpBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            errorMessage: null,
            agreed: false
        };
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect}/>
        }
        return (
            <div className={styles.box}>
                <p className={styles.headerText}>Sign Up</p>
                <Form onSubmit={this.signUp}>
                    <Form.Group controlId="email">
                        <Form.Label className={styles.formLabel}>Email Address</Form.Label>
                        <Form.Control
                            className={styles.formTextBox}
                            ref={val => this.emailVal = val}
                            name="signUpEmail" type="email"/>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label className={styles.formLabel}>Password</Form.Label>
                        <Form.Control
                            className={styles.formTextBox}
                            ref={val => this.passwordVal = val}
                            name="signUpPassword" type="password"/>
                    </Form.Group>
                    <Form.Group controlId="confirmPassword">
                        <Form.Label className={styles.formLabel}>Confirm Password</Form.Label>
                        <Form.Control
                            className={styles.formTextBox}
                            ref={val => this.confirmPasswordVal = val}
                            name="confirmPassword" type="password"/>
                    </Form.Group>
                    <Form.Group>
                        <div className={styles.checkBoxLabel}>
                            I agree to CleanView's {' '}
                            <a 
                            target="_blank"
                            href="https://cleanview-location214612-prod.s3.us-east-1.amazonaws.com/public/CleanView_Terms_Of_Use.pdf"
                            className={styles.linkText}>
                                Terms of Use {' '}
                            </a>
                        </div>
                        <Form.Control
                            className={styles.formCheckBox}
                            onChange={this.toggleSubmitBtn}
                            name="agree"
                            type="checkbox"
                        />
                    </Form.Group>
                </Form>
                {this.displayError()}
                <Button disabled={!this.state.agreed} onClick={this.signUp} style={submitBtn} type='submit' variant="primary">
                    Create Account
                </Button><br/>
                <div>
                    Already have an account? {' '}
                    <div className={styles.linkText}
                         onClick={() => this.props.changeFunc("login")}>Sign in
                    </div>
                </div>
            </div>

        );
    }

    signUp = () => {
        if (this.verifyCorrectFormatting()){
            this.props.setEmailFunc(this.emailVal.value);
            Auth.signUp({
                username: this.emailVal.value,
                password: this.passwordVal.value,
                attributes: {email: this.emailVal.value}})
                .then(() => {
                    this.props.changeFunc("verifyAccount")
                    this.props.setEmailFunc(this.emailVal.value)
                })
                .catch((error) => this.setState({errorMessage: error.message}))
        }
    }

    verifyCorrectFormatting = () => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,128}$/;

        if (!emailRegex.test(String(this.emailVal.value).toLowerCase())){
            this.setState({errorMessage: 'Email address is invalid'})
            return false;
        }
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
        if (message === 'Custom auth lambda trigger is not configured for the user pool.')
            message = 'Password is required';
        if (message === 'Username cannot be empty')
            message = 'Email address is required';
        return (
            <Alert variant='danger'>{message}</Alert>
        );
    }

    toggleSubmitBtn = (val) => {
        if (val.target.checked)
            this.setState({agreed: true})
        else
            this.setState({agreed: false})
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

export default SignUpBox;
