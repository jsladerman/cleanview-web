import React, {Component} from 'react';
import styles from './css/SettingsBoxes.module.css';
import {Field, Form, Formik} from "formik";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"
import Modal from "@trendmicro/react-modal";
import {Auth} from "aws-amplify";
import VerifyNewEmailBox from "./VerifyNewEmailBox";

class ChangeEmailBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showVerify: false,
            authInfo: this.props.authInfo
        }
    }

    render() {
        if (this.state.showVerify) {
            return (
                <Modal show={this.state.showVerify}
                       onClose={() => this.setState({showVerify: false})}
                       showCloseButton={true}
                       style={{borderRadius: '100px', border: 'none'}}>
                    <VerifyNewEmailBox
                        authLoadFunc={this.reloadAuthInfo}
                        modalFunc={() => {
                            this.setState({showVerify: false});
                        }}
                    />
                </Modal>
            )
        }
        return (
            <div>
                <div>
                    <Formik
                        initialValues={{
                            email: this.state.authInfo.attributes.email
                        }}
                        onSubmit={this.onSubmit}>
                        <Form>
                            <label className={styles.formLabel}
                                   style={{marginLeft: '12px'}}>
                                Email Address {this.unverifiedLabel()}
                            </label>
                            <Field as={FormControl}
                                   className={styles.formInput} name='email'
                                   type='email'/>
                            <br/>
                            <Button type='submit' variant='info'
                                    className={styles.formSubmitBtn}>
                                Update
                            </Button>
                            {this.renderVerifyButton()}
                        </Form>
                    </Formik>
                </div>
            </div>
        );
    }

    onSubmit = (params) => {
        this.setState({updateEmailSuccess: false, emailError: false});
        const reqParams = {
            email: params.email
        }

        Auth.currentAuthenticatedUser()
            .then(user => {
                Auth.updateUserAttributes(user, reqParams)
                    .then(() => {
                        this.props.successFunc()
                        this.reloadAuthInfo()
                    } )
                    .catch((error) => this.props.errorFunc(error.message))
            })
            .catch((error) => this.props.errorFunc(error.message))
    }

    reloadAuthInfo = () => {
        console.log('here')
        Auth.currentUserInfo()
            .then(user => {
                this.setState({
                    authInfo: user
                });
            })
            .catch(error => {
                console.log("Error: " + error)
            });
    }

    renderVerifyButton = () => {
        if (!this.state.authInfo.attributes.email_verified)
            return (
                <Button variant='danger'
                        onClick={() => this.setState({showVerify: true})}
                        className={styles.verifyEmailBtn}>
                    Verify
                </Button>
            )
        return null;
    }

    unverifiedLabel = () => {
        if (!this.state.authInfo.attributes.email_verified)
            return (
                <label
                    style={{color: 'red'}}>
                    (unverified)
                </label>
            )
        return null;
    }
}

export default ChangeEmailBox;
