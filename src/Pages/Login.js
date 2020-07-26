import React, {Component} from 'react';
import styles from './css/Login.module.css';
import logo from '../images/CleanView-Logo-Grey-text-with-tagline.svg'
import Auth from "@aws-amplify/auth"
import LoginBox from "../Components/Login/LoginBox";
import SignUpBox from "../Components/Login/SignUpBox";
import ForgotPasswordBox from "../Components/Login/ForgotPasswordBox";
import VerifyAccountBox from "../Components/Login/VerifyAccountBox";
import {Redirect} from 'react-router-dom';
import Button from 'react-bootstrap/Button'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            authComponent: 'login',
            userEmail: ''
        }
    }

    componentDidMount() {
        Auth.currentAuthenticatedUser({
            bypassCache: true
        }).then(user => {
            console.log(user);
            this.setState({signedIn: true, redirect: '/home/locations'})
        })
            .catch(err => console.log("Error: " + err))
    }

    render() {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect}/>
        }
        return (
            <div className={styles.page}>
                <div className={styles.logoSide}>
                    <img className={styles.logo} src={logo} alt=''/>
                    <div className={styles.infoDiv}>
                        <p>What can Cleanview do for you?</p>
                        <Button href='https://www.cleanview.io/' style={learnMoreBtn}>Learn More</Button>
                    </div>
                </div>
                <div className={styles.authSide}>
                    {this.displayAuthBox()}
                </div>
            </div>
        );
    }

    displayAuthBox = () => {
        switch (this.state.authComponent) {
            case 'login':
                return <LoginBox
                    changeFunc={this.changeAuthBox}
                    setEmailFunc={this.setEmail}/>
            case 'signup':
                return <SignUpBox
                    changeFunc={this.changeAuthBox}
                    setEmailFunc={this.setEmail}/>
            case 'forgotPassword':
                return <ForgotPasswordBox changeFunc={this.changeAuthBox}/>
            case 'verifyAccount':
                return <VerifyAccountBox
                    changeFunc={this.changeAuthBox}
                    email={this.state.userEmail}/>
            default:
                return <LoginBox changeFunc={this.changeAuthBox}/>
        }
    }

    changeAuthBox = (authComponent) => {
        this.setState({authComponent: authComponent});
    }

    setEmail = (email) => {
        this.setState({userEmail: email});
    }
}

const learnMoreBtn = {
    backgroundColor:'#191A26',
    boxShadow: '0px 4px 11px -2px rgba(0,0,0,0.55)',
    fontWeight: 'bold',
    fontSize: '20px',
    paddingLeft: '28px',
    paddingRight: '28px',
    borderColor: 'transparent'
}

export default Login;
