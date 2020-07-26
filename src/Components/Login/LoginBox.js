import React, {Component} from 'react';
import styles from './css/LoginBox.module.css'
import {Redirect} from "react-router-dom";
import Auth from "@aws-amplify/auth"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'

class LoginBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            errorMessage: null
        };
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect}/>
        }
        return (
            <div className={styles.box}>
                <p className={styles.headerText}>Sign In</p>
                <Form onSubmit={this.logIn}>
                    <Form.Group controlId="email">
                        <Form.Label className={styles.formLabel}>Email Address</Form.Label>
                        <Form.Control
                            className={styles.formTextBox}
                            ref={val => this.emailVal = val}
                            name="email" type="text"/>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label className={styles.formLabel}>Password</Form.Label>
                        <Form.Control
                            className={styles.formTextBox}
                            ref={val => this.passwordVal = val}
                            name="password" type="password"/>
                    </Form.Group>
                </Form>
                {this.displayError()}
                <Button onClick={this.logIn} style={submitBtn} type='submit' variant="primary">
                    Enter
                </Button><br/>
                <div>
                    Don't have an account yet? {' '}
                    <div className={styles.signUpButton}
                         onClick={() => this.props.changeFunc("signup")}>Sign up
                    </div>
                </div>
            </div>

        );
    }

    logIn = () => {
        this.props.setEmailFunc(this.emailVal.value);
        Auth.signIn(this.emailVal.value, this.passwordVal.value)
            .then(() => this.setState({redirect: '/home/locations'}))
            .catch((error) => {
                if (error.message === 'User is not confirmed.')
                    this.props.changeFunc("verifyAccount");
                else
                    this.setState({errorMessage: error.message});
            });
    };

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

export default LoginBox;
