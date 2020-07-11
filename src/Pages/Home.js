import React from 'react';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import AddLocation from '../Components/ManagerPage/AddLocation'
import ManagedLocationList from '../Components/ManagerPage/ManagedLocationList'
import LocationPage from '../Pages/LocationPage'

const Home = () => (
    <div>
        <h1>Hello</h1>
        <AmplifyAuthenticator>
            <LocationPage />
                <AmplifySignOut />
                <AddLocation />
        </AmplifyAuthenticator>
    </div>

);

export default Home;
