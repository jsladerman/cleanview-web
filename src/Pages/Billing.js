import React, {Component} from 'react';
import styles from './css/Billing.module.css';

class Billing extends Component {
    render() {
        const imgSrc = require('./../images/FirstMonth.png')
        return (
            <div>
                <div className={styles.body}>
                    <h1 className={styles.headerText}>Billing Dashboard</h1>
                    <br />
                    <img
                    src={imgSrc}
                    alt={"Enjoy your first month, on us! 😊"}
                    height={600}
                    />
                </div>
            </div>

        );
    }
}

export default Billing;
