import React, { Component } from 'react';
// import styles from './css/Home.css';
import { Auth } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignIn, } from '@aws-amplify/ui-react';
import ManagedLocationList from '../Components/ManagerPage/ManagedLocationList';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false
        }
    }

    render() {
        console.log("Signed in: " + this.state.signedIn);
        return (
            <AmplifyAuthenticator>
                <AmplifySignIn headerText="Sign in to your account"
                               slot="sign-in" onFormSubmit={this.onSignInSubmit}/>
                <ManagedLocationList/>
                <button onClick={this.signOut}>Sign out</button>
            </AmplifyAuthenticator>
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
        setTimeout( () =>
            Auth.currentAuthenticatedUser({
                bypassCache: true
            }).then(user => {
                console.log(user);
                this.setState({signedIn: true})
            })
                .catch(err => console.log("Error: " + err)),
            1500
        );

    }
}

export default Home;
