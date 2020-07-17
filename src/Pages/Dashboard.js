import React, {Component} from 'react';
import styles from './css/Dashboard.css';
import {Redirect} from 'react-router-dom';
import '@trendmicro/react-modal/dist/react-modal.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <Redirect to="/login" />
            </div>
        );
    }

}

export default Dashboard;