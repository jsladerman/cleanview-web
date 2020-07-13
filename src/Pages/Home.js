import React, {Component} from 'react';
import styles from './css/Home.css';
import Modal from '@trendmicro/react-modal';
import '@trendmicro/react-modal/dist/react-modal.css';
import {Auth} from 'aws-amplify';
import {AmplifyAuthenticator, AmplifySignIn,} from '@aws-amplify/ui-react';
import ManagedLocationList from '../Components/ManagerPage/ManagedLocationList';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false,
            showModal: false
        }
    }

    render() {
        console.log("Signed in: " + this.state.signedIn);
        console.log(this.state.showModal);
        return (
            <div>
                <Modal show={this.state.showModal} onClose={this.showModal} showCloseButton={false}>
                    <ManagedLocationList/>
                </Modal>
                <button onClick={this.showModal}
                        style={{visibility: this.state.showModal ? 'hidden' : 'visible'}}>Test Modal
                </button>
                <AmplifyAuthenticator>
                    <AmplifySignIn headerText="Sign in to your account"
                                   slot="sign-in" onFormSubmit={this.onSignInSubmit}/>
                    {/*<ManagedLocationList/>*/}
                    <button onClick={this.signOut}>Sign out</button>
                </AmplifyAuthenticator>
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

    showModal = () => {
        this.setState({
            showModal: !this.state.showModal
        });
    };

}

export default Home;
