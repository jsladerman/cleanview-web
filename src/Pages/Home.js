import React, {Component} from 'react';
import styles from './css/Home.css';
import '@trendmicro/react-modal/dist/react-modal.css';
import {Auth} from 'aws-amplify';
import {AmplifyAuthenticator, AmplifySignIn,} from '@aws-amplify/ui-react';
import ManagedLocationList from '../Components/ManagerPage/ManagedLocationList';

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
            <div class = "sign-in-div">
                <h2 class="title-message">Welcome back to CleanView</h2>
                <p class="subtitle-message">Log in to launch your management dashboard</p>

                <div class="sign-in">
                    <AmplifyAuthenticator>
                        <AmplifySignIn headerText="Sign in to your account"
                                    slot="sign-in" onFormSubmit={this.onSignInSubmit}/>
                        {/*<ManagedLocationList/>*/}
                    </AmplifyAuthenticator>
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
                    this.setState({signedIn: true})
                })
                    .catch(err => console.log("Error: " + err)),
            1500
        );
    };

}

export default Home;
