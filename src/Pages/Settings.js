import React, {Component} from 'react';
import styles from './css/Settings.module.css';
import {API} from 'aws-amplify'
import Alert from 'react-bootstrap/Alert'
import SettingsBox from "../Components/Dashboard/SettingsBox";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateSuccess: false,
            phoneNumError: false
        }
    }

    render() {
        if (!this.props.authLoaded)
            return <img
                src={require("../images/dashboardLoader.svg")}
                alt=''
                height='100%'
                width='100%'
            />
        return (
            <div>
                <div className={styles.body}>
                    {this.renderSuccessAlert()}
                    {this.renderErrorAlert()}
                    <div className={styles.settingsBox}>
                        <h3>Your Information</h3>
                        <div className={styles.separator}/>
                        <br/>
                        <SettingsBox
                            authInfo={this.props.authInfo}
                            settingsInfo={this.props.settingsInfo}
                            submitFunc={this.updateSettings}
                            phoneNumErrorFunc={this.triggerErrorAlert}
                        />
                    </div>
                </div>
            </div>

        );
    }

    updateSettings = (params) => {
        let apiName = 'AccountSettingsApi'
        let path = '/account/manager'
        const requestData = {
            headers: {},
            response: true,
            // plz include all of below parameters
            // if u need more or less, lmk and we can change the patch lambda together
            body: {
                id: this.props.authInfo.username, // this is to identify the record
                email: this.props.authInfo.attributes.email, // the rest are for updating
                username: this.props.authInfo.username,
                firstName: params.firstName,
                lastName: params.lastName,
                phone: params.phone
            },
        }

        API.patch(apiName, path, requestData)
            .then(() => {
                this.setState({updateSuccess: true, phoneNumError: false})
                this.props.getSettingsFunc(this.props.authInfo.username)
            })
            .catch(error => {
                console.log("Error: " + error)
            })
    }

    renderSuccessAlert = () => {
        if (this.state.updateSuccess)
            return (
                <Alert variant="success" dismissible
                       onClose={() => this.setState({updateSuccess: false})}
                       style={{whiteSpace: 'normal'}}>
                    <Alert.Heading>Information Updated Successfully</Alert.Heading>
                </Alert>
            )
    }

    triggerErrorAlert = () => {
        this.setState({phoneNumError: true, updateSuccess: false});
    }

    renderErrorAlert = () => {
        if (this.state.phoneNumError)
            return (
                <Alert variant="danger" dismissible
                       onClose={() => this.setState({phoneNumError: false})}
                       style={{whiteSpace: 'normal'}}>
                    <Alert.Heading>Error</Alert.Heading>
                    <div>
                        Phone number must be in this format: 800-555-1234
                    </div>
                </Alert>
            )
    }
}

export default Settings;
