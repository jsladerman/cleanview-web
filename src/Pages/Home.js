import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import styles from './css/Home.css';
import Modal from '@trendmicro/react-modal';
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
            showModal: false
        }
    }

    render() {
        console.log("Signed in: " + this.state.signedIn);
        console.log(this.state.showModal);
        return (
            <div className="sign-in-div">
                {/*<Card style={{ width: '18rem' }}>*/}
                {/*    /!*<Card.Img variant="top" src="holder.js/100px180" />*!/*/}
                {/*    <Card.Body>*/}
                {/*        <Card.Title>Card Title</Card.Title>*/}
                {/*        <Card.Text>*/}
                {/*            Some quick example text to build on the card title and make up the bulk of*/}
                {/*            the card's content.*/}
                {/*        </Card.Text>*/}
                {/*    </Card.Body>*/}
                {/*</Card>*/}
                <h2 className="title-message">Welcome back to CleanView</h2>
                <p className="subtitle-message">Log in to launch your management dashboard</p>

                <Modal style={{borderRadius:'200px'}} show={this.state.showModal}
                       onClose={this.showModal} showCloseButton={false}>
                    <ManagedLocationList/>
                </Modal>
                <button onClick={this.showModal}
                        style={{visibility: this.state.showModal ? 'hidden' : 'visible'}}>Test Modal
                </button>

                <div className="sign-in">
                    <AmplifyAuthenticator>
                        <AmplifySignIn headerText="Sign in to your account"
                                    slot="sign-in" onFormSubmit={this.onSignInSubmit}/>
                        <button onClick={this.signOut}>Sign out</button>
                    </AmplifyAuthenticator>
                </div>
                <div style={{visibility: this.state.signedIn ? 'visible' : 'hidden'}}>
                    <ManagedLocationInfo/>
                </div>
            </div>
        );
    }

    signOut = () => {
        try {
            Auth.signOut()
                .then(response => {
                    console.log(response);
                    this.setState({signedIn: false, showModal: false});
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

    showModal = () => {
        this.setState({
            showModal: !this.state.showModal
        });
    };

}

export default Home;
