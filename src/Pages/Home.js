import React, {Component} from 'react';
import styles from './css/Home.css';
import logo from '../images/CleanView-Logo-Grey-text.png'
import '@trendmicro/react-modal/dist/react-modal.css';
import {Auth} from 'aws-amplify';
import {AmplifyAuthenticator, AmplifySignIn,} from '@aws-amplify/ui-react';
import ManagedLocationList from '../Components/ManagerPage/ManagedLocationList';
import ManagedLocationInfo from '../Components/ManagedLocationPage/ManagedLocationInfo'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false,
        }
    }

    render() {
        console.log("Signed in: " + this.state.signedIn);
        return (
            <div className="page">
                <img className="logo" src={logo} alt=""/>
                <div className="sign-in-div">
                    <h2 className="title-message">Welcome back to CleanView</h2>
                    <p className="subtitle-message">Log in to launch your management dashboard</p>
                    <div className="sign-in">
                        <AmplifyAuthenticator>
                            <AmplifySignIn headerText="Sign in to your account"
                                           slot="sign-in" onFormSubmit={this.onSignInSubmit}/>
                            <button onClick={this.signOut}>Sign out</button>
                        </AmplifyAuthenticator>
                    </div>
                </div>
            </div>
        );
    }

    signOut = () => {
        try {
            Auth.signOut()
                .then(response => {
                    console.log(response);
                    this.setState({signedIn: false});
                });
        } catch (error) {
            console.log('error signing out: ', error);
        }
    };

    onSignInSubmit = () => {
        console.log("onSigninSubmit");
        setTimeout(() =>
                Auth.currentAuthenticatedUser({
                    bypassCache: true
                }).then(user => {
                    console.log(user);
                    this.setState({signedIn: true, showModal: false})
                })
                    .catch(err => console.log("Error: " + err)),
            1500
        );
    };
}

export default Home;