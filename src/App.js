import React from 'react';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const App = () => (
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

export default App;