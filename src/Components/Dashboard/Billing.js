import React, {Component} from 'react';
import styles from './css/Billing.module.css';

class Billing extends Component {
    render() {
        return (
            <div>
                <div className={styles.body}>
                    <h1 className={styles.headerText}>Billing</h1>
                    <div className={styles.firstMonthBox}>
                        <h2 className={styles.firstMonth}>Enjoy your first month, on us!</h2>
                    </div>
                </div>
            </div>

        );
    }
}

export default Billing;