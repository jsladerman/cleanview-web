import React, {Component} from 'react';
import styles from './css/Settings.module.css';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        }
    }

    render() {
        return (
            <div>
                <div className={styles.body}>
                    <h1 className={styles.headerText}>Settings</h1>
                </div>
            </div>

        );
    }
}

export default Settings;
