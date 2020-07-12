import React from 'react';
import styles from './css/Home.css';
import { Auth } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignIn, AmplifySignOut} from '@aws-amplify/ui-react';
import ManagedLocationList from '../Components/ManagerPage/ManagedLocationList';

const Home = () => {
    return(
            <AmplifyAuthenticator >
                <AmplifySignIn headerText="Sign in to your account"
                               slot="sign-in" handleAuthStateChange={onSignIn}/>
                <ManagedLocationList />
                <button onClick={signOut}>Sign out</button>
            </AmplifyAuthenticator>
    );
};

async function signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

function onSignIn() {
    // TODO: redirect
}

export default Home;
