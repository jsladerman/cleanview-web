import React from 'react';
import styles from './Home.css';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

const Home = () => {
    return(
        <div>
            <AmplifyAuthenticator style={divStyle}>
                <div>
                    My App
                    <AmplifySignOut />
                </div>
                My app
            </AmplifyAuthenticator>
        </div>
    );
};

const divStyle = {
    position: 'absolute',
    marginLeft: 823,
};

export default Home;