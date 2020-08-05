import React, {Component} from 'react';
import styles from './css/Settings.module.css';
import {Auth, API} from 'aws-amplify'
import Alert from 'react-bootstrap/Alert'
import SettingsBox from "../Components/Dashboard/SettingsBox";
import ChangePasswordBox from "../Components/Settings/ChangePasswordBox";
import ChangeEmailBox from "../Components/Settings/ChangeEmailBox";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateSettingsSuccess: false,
            updatePasswordSuccess: false,
            settingsError: false,
            passwordError: false,
            passwordErrorMsg: '',
            updateEmailSuccess: false,
            emailError: false,
            emailErrorMsg: '',
            emailVerified: true
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
                    {this.state.updateSettingsSuccess ?
                        this.renderSuccessAlert('Information Updated Successfully') : null}
                    {this.state.settingsError ?
                        this.renderErrorAlert('Phone number must be in this format: 800-555-1234') : null}
                    <div className={styles.settingsBox}>
                        <h3>Your Information</h3>
                        <div className={styles.separator}/>
                        <br/>
                        <SettingsBox
                            authInfo={this.props.authInfo}
                            settingsInfo={this.props.settingsInfo}
                            submitFunc={this.updateSettings}
                            errorFunc={this.triggerPhoneNumErrorAlert}
                        />
                    </div>
                    {this.state.updateEmailSuccess ?
                        this.renderSuccessAlert(
                            'Email Address Updated Successfully',
                            'Please check inbox for confirmation code.') : null}
                    {this.state.emailError ?
                        this.renderErrorAlert(this.state.passwordErrorMsg) : null}
                    <div className={styles.emailBox}>
                        <h3>Change Email Address</h3>
                        <div className={styles.separator}/>
                        <br/>
                        <ChangeEmailBox
                            authInfo={this.props.authInfo}
                            authLoadFunc={this.props.authLoadFunc}
                            successFunc={() => {
                                this.setState({updateEmailSuccess: true})
                            }}
                            errorFunc={this.triggerEmailErrorAlert}
                        />
                    </div>
                    {this.state.updatePasswordSuccess ?
                        this.renderSuccessAlert('Password Updated Successfully') : null}
                    {this.state.passwordError ?
                        this.renderErrorAlert(this.state.passwordErrorMsg) : null}
                    <div className={styles.passwordBox}>
                        <h3>Change Password</h3>
                        <div className={styles.separator}/>
                        <br/>
                        <ChangePasswordBox
                            submitFunc={this.updatePassword}
                            errorFunc={this.triggerPasswordErrorAlert}
                        />
                    </div>
                </div>
            </div>

        );
    }

    updateSettings = (params) => {
        this.setState({updateSettingsSuccess: false, settingsError: false})
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
                this.setState({updateSettingsSuccess: true, settingsError: false})
                this.props.getSettingsFunc(this.props.authInfo.username)
            })
            .catch(error => {
                console.log("Error: " + error)
            })
    }

    updatePassword = (params) => {
        this.setState({updatePasswordSuccess: false, passwordError: false});
        Auth.currentAuthenticatedUser()
            .then(user => {
                Auth.changePassword(user, params.oldPassword, params.newPassword)
                    .then(() => this.setState({updatePasswordSuccess: true, passwordError: false}))
                    .catch(() => this.triggerPasswordErrorAlert('Old Password is Incorrect'))
            })
            .catch(() => this.triggerPasswordErrorAlert('Old Password is Incorrect'))
    }

    renderSuccessAlert = (msg, subMsg) => {
        return (
            <Alert variant="success" dismissible
                   onClose={() => this.setState({
                       updateSettingsSuccess: false,
                       updateEmailSuccess: false,
                       updatePasswordSuccess: false
                   })}
                   style={{whiteSpace: 'normal'}}>
                <Alert.Heading>{msg}</Alert.Heading>
                <div>
                    {subMsg ? subMsg : null}
                </div>
            </Alert>
        )
    }

    triggerPhoneNumErrorAlert = () => {
        this.setState({settingsError: true, updateSettingsSuccess: false});
    }

    triggerEmailErrorAlert = (msg) => {
        this.setState({emailErrorMsg: msg, emailError: true, updateEmailSuccess: false});
    }

    triggerPasswordErrorAlert = (msg) => {
        this.setState({passwordErrorMsg: msg, passwordError: true, updatePasswordSuccess: false});
    }

    renderErrorAlert = (msg) => {
        if (this.state.settingsError || this.state.passwordError)
            return (
                <Alert variant="danger" dismissible
                       onClose={() => this.setState({settingsError: false, passwordError: false})}
                       style={{whiteSpace: 'normal'}}>
                    <Alert.Heading>Error</Alert.Heading>
                    <div>
                        {msg}
                    </div>
                </Alert>
            )
    }
}

export default Settings;
