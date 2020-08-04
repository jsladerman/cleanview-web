import React, {Component} from 'react';
import styles from './css/SettingsBoxes.module.css';
import {Field, Form, Formik} from "formik";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl"
import SettingsBox from "../Dashboard/SettingsBox";
import Modal from "@trendmicro/react-modal";
import VerifyAccountBox from "../Login/VerifyAccountBox";
import {Auth} from "aws-amplify";

class ChangeEmailBox extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        //TODO: if not verified don't force it-
        //      just have a red marker and a button that says verify here

        // if (!this.props.authInfo.attributes.email_verified) {
        //     return (
        //         <Modal show={true}
        //                showCloseButton={false}
        //                style={{
        //                    backgroundColor: 'transparent',
        //                    border: '0',
        //                    boxShadow: '0 0 0 0 rgba(0,0,0,0)'
        //                }}>
        //             <div className={styles.verifyModalDiv}
        //                  style={{height: this.state.phoneNumError ? '473px' : '375px'}}>
        //                 <h4 style={{textAlign: 'center', fontFamily: 'Roboto, sans-serif'}}>
        //                     Please confirm the verification code sent to your new email address
        //                 </h4><br/>
        //                 <VerifyAccountBox/>
        //             </div>
        //         </Modal>
        //     )
        // }
        console.log(this.props.authInfo)
        return (
            <div>
                <div>
                    <Formik
                        initialValues={{
                            email: this.props.authInfo.attributes.email
                        }}
                        onSubmit={this.onSubmit}>
                        <Form>
                            <label className={styles.formLabel}
                                   style={{marginLeft: '12px'}}>Email Address
                            </label>
                            <Field as={FormControl}
                                   className={styles.formInput} name='email'
                                   type='email'/>
                            <br/>
                            <Button type='submit' variant='info'
                                    className={styles.formSubmitBtn}>
                                Update
                            </Button>
                        </Form>
                    </Formik>
                </div>
            </div>
        );
    }

    // onSubmit = (values) => {
    //     const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,128}$/;
    //
    //     if (values.newPassword !== values.confirmPassword) {
    //         this.props.errorFunc('Password fields must be the same')
    //     } else if (!passwordRegex.test(values.newPassword)) {
    //         this.props.errorFunc('Minimum password length is 8, including uppercase, lowercase, and numbers')
    //     } else {
    //         this.props.submitFunc(values);
    //     }
    // }

    onSubmit = (params) => {
        this.setState({updateEmailSuccess: false, emailError: false});
        const reqParams = {
            email: params.email
        }

        Auth.currentAuthenticatedUser()
            .then(user => {
                console.log('here')
                Auth.updateUserAttributes(user, reqParams)
                    .then((res) => console.log(res))
                    // .catch((error) => this.triggerEmailErrorAlert(error.message))
                    .catch((error) => console.log('inner' + error.message))
            })
            // .catch((error) => this.triggerEmailErrorAlert(error.message))
            .catch((error) => console.log('inner' + error.message))
    }
}

export default ChangeEmailBox;
