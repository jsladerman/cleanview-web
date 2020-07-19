import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import Testing from './Testing';


Amplify.configure(awsconfig);

ReactDOM.render(
  <React.StrictMode>
    <Testing />
  </React.StrictMode>,
  document.getElementById('root')
);