import React, {Component} from 'react';
import styles from './css/Billing.module.css';

class Billing extends Component {
    render() {
        return (
            <div>
                <div className={styles.body}>
                    <h1 className={styles.headerText}>Billing Dashboard</h1>
                    <h4 className={styles.firstMonth}>Enjoy your first month, on us! 😊</h4>
                </div>
            </div>

        );
    }
}

export default Billing;