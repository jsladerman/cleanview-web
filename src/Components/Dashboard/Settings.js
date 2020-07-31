import React, {Component} from 'react';
import styles from './css/Settings.module.css';
import uuid from 'react-uuid';
import {API, Auth} from 'aws-amplify'

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


    getbyId = (accountId) => {
        let apiName = 'AccountSettingsApi'
        let path = '/account/manager'
        const requestParams = {
            headers: {},
            queryStringParameters: {
                id: accountId
            }
        }

        API.get(apiName, path, requestParams)
        .then(response => {
            console.log('Account: ' + response);
        })
        .catch(error => {
            console.log('Error: ' + error)
        })
    }

    createAccount = (params) => {
        let apiName = 'AccountSettingsApi'
        let path = '/account'
        const requestParams = {
            headers: {},
            body: {
                id: uuid(), // mandatory
                email: params.email, 
                username: params.username,
                firstName: params.firstName,
                lastName: params.lastName,
                phone: params.phone,
                creationDate: params.creationDate
                // whatever u wanna add
            }
        }

        API.post(apiName, path, requestParams)
        .then(response => {
            console.log('Account creation successful: ' + response);
        })
        .catch(error => {
            console.log('Error in account creation: ' + error)
        })

    }

    updateAccount = (params) => {
        let apiName = 'AccountSettingsApi'
        let path = '/account/manager'
        const requestData = {
            headers: {},
            response: true,
            // plz include all of below parameters, if u need more or less, lmk and we can change the patch lambda together
            body: {
                id: params.id, // this is to identify the record
                email: params.email, // the rest are for updating
                username: params.username,
                firstName: params.firstName,
                lastName: params.lastName,
                phone: params.phone,
            },
        }

        API.patch(apiName, path, requestData)
        .then(response => {
            console.log("Update successful", response);
            // call the get request and ensure the data is there
        })
        .catch(error => {
            console.log("Error: " + error)
        })
    }
}

export default Settings;
