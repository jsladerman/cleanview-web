import React, {Component} from 'react';
import styles from './css/AuthBoxes.module.css'
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
            errorMessage: null,
            loading: false
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
                        <Form.Label style={{float: 'right', marginTop: '1.5px', cursor: 'pointer'}}
                                    className={styles.linkText}
                                    onClick={() => this.props.changeFunc("forgotPassword")}>Forgot password?
                        </Form.Label>
                        <Form.Control
                            className={styles.formTextBox}
                            ref={val => this.passwordVal = val}
                            name="password" type="password"/>
                    </Form.Group>
                </Form>
                {this.displayError()}
                {this.renderButton()}
                <br/>
                <div>
                    Don't have an account yet? {' '}
                    <div className={styles.linkText}
                         onClick={() => this.props.changeFunc("signup")}>Sign up
                    </div>
                </div>
            </div>

        );
    }

    logIn = () => {
        this.setState({loading: true});
        this.props.setEmailFunc(this.emailVal.value);
        Auth.signIn(this.emailVal.value, this.passwordVal.value)
            .then(() => this.setState({redirect: '/home/locations'}))
            .catch((error) => {
                if (error.message === 'User is not confirmed.')
                    this.props.changeFunc("verifyAccount");
                else
                    this.setState({errorMessage: error.message, loading: false});
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

    renderButton = () => {
        if (this.state.loading)
            return <img
                src={require("../../images/loadingSpinner.svg")}
                alt=''
                height='40px'
            />
        else
            return <Button onClick={this.logIn}
                           style={submitBtn}
                           type='submit'
                           variant="primary">
                Enter
            </Button>
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
