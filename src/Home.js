import React from 'react';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import QRCodeGenerator from './Components/LocationPage/QRCodeGenerator'

Amplify.configure(awsconfig);

const Home = () => (
  <div>
    <QRCodeGenerator />
  </div>
);

export default Home;