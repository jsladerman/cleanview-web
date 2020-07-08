import React from 'react';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

const Home = () => (
    <div>
        <h1>Hello</h1>
        <AmplifyAuthenticator>
            <div>
                My App
                <AmplifySignOut />
            </div>
            My app
        </AmplifyAuthenticator>
    </div>

);

export default Home;