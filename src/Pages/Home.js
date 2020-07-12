import React from 'react';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import AddLocation from '../Components/ManagerPage/AddLocation'
import ManagedLocationList from '../Components/ManagerPage/ManagedLocationList'

const Home = () => (
    <div>
        <h1>Hello</h1>
        <AmplifyAuthenticator>
            <ManagedLocationList />
                <AmplifySignOut />
                <AddLocation />
        </AmplifyAuthenticator>
    </div>

);

export default Home;
