import React from 'react';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import LocationPage from './Pages/LocationPage'

Amplify.configure(awsconfig);

const Home = () => (
  <div>
    <LocationPage />
  </div>
);

export default Home;