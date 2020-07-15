import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Pages/App';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import 'bootstrap/dist/css/bootstrap.min.css';


Amplify.configure(awsconfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);