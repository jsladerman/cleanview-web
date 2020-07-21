import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import {BrowserRouter} from "react-router-dom";


Amplify.configure(awsconfig);

ReactDOM.render(
    <BrowserRouter>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </BrowserRouter>,
    document.getElementById('root')
);
