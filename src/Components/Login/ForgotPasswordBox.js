import React, {Component} from 'react';
import styles from './css/VerifyAccountBox.module.css'
import {Redirect} from "react-router-dom";
import Auth from "@aws-amplify/auth"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from "react-bootstrap/Alert";



class ForgotPasswordBox extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect}/>
        }
        return (
            <div className="form">
                <h1>Forgot Password</h1>
            </div>

        );
    }
}

export default ForgotPasswordBox;
