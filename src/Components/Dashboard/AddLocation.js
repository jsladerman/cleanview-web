import React, {Component} from 'react';
import styles from './css/AddLocation.module.css'
import {API} from 'aws-amplify';
import Auth from "@aws-amplify/auth"
import uuid from 'react-uuid';
import {Field, Form, Formik, ErrorMessage} from 'formik';
import Col from 'react-bootstrap/Col'
import Button from "react-bootstrap/Button";

class AddLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
    }

    makeLocation = (values) => {
        const apiName = 'ManageLocationApi'; // replace this with your api name.
        const path = '/location'; //replace this with the path you have configured on your API
        console.log(values);
        // const requestData = {
        //     body: {
        //         id: uuid(),
        //         loc_name: values.name,
        //         manager: await Auth.currentAuthenticatedUser()
        //             .then(user => user["username"])
        //             .catch(error => console.log("Error: " + error)),
        //         addr_line_1: values.addr.line1,
        //         addr_line_2: values.addr.line2,
        //         addr_city: values.addr.city,
        //         addr_state: values.addr.state,
        //         loc_type: values.type,
        //         subscription_status: "free_trial",
        //         cleaning_practices: {
        //             employee_masks: 1,
        //             social_distancing: 1,
        //             dining_in: 0
        //         },
        //         is_confirmed: 0
        //     },
        //     headers: {} // OPTIONAL;
        // };
        //
        // API.post(apiName, path, requestData)
        //     .then(response => {
        //         console.log("Location Add Successful: " + response);
        //         this.props.modalFunc();
        //     })
        //     .catch(error => {
        //         console.log("Error: " + error)
        //     })
    };

    render() {
        return (
            <div className={styles.addLocation}>
                <img
                    type='file'
                    src={require("../../images/addLocationCamera.svg")}
                    alt=''
                    height="50px"
                    style={{cursor:'pointer', float:'left'}}
                    // onClick={()=>alert('test')}
                />
                <div className={styles.addLocationHeader}>
                    Add Location
                </div>
                <Formik
                    initialValues={{}}
                    onSubmit={this.makeLocation}>
                    <Form className={styles.form}>
                            <div className={styles.formCols}>
                                <div className={styles.formCol}>
                                    <div className={styles.formColHeader}>General Information</div>
                                    <div className={styles.formLabel}>Business Name</div>
                                    <Field className={styles.formInput} type='input' name='name'/>
                                    <div className={styles.formLabel}>Business Type</div>
                                    <Field className={styles.formInput} type='input' name='type'/>
                                    <div className={styles.formLabel}>Business Style</div>
                                    <Field className={styles.formInput} type='input' name='products'/>
                                    <div className={styles.formLabel}>Business Email</div>
                                    <Field className={styles.formInput} type='input' name='type'/>
                                    <div className={styles.formLabel}>Products Phone #</div>
                                    <Field className={styles.formInput} type='input' name='products'/>
                                </div>
                                <div className={styles.formCol}>
                                    <div className={styles.formColHeader}>Business Address</div>
                                    <div className={styles.formLabel}>Street</div>
                                    <Field className={styles.formInput} type='input' name="addr.line1"/>
                                    <div className={styles.formLabel}>Apt, Suite, etc.</div>
                                    <Field className={styles.formInput} type='input' name="street"/>
                                    <div className={styles.formLabel}>City</div>
                                    <Field className={styles.formInput} type='input' name="street"/>
                                    <div style={{width:'40%', float:'left', marginRight: '12px'}}>
                                        <div className={styles.formLabel}>State</div>
                                        <Field style={{width:'100%'}} type='input' name="street"/>
                                    </div>
                                    <div style={{width:'50%', float:'left'}}>
                                        <div className={styles.formLabel}>Zip Code</div>
                                        <Field style={{width:'100%'}} type='input' name="street"/>
                                    </div>
                                </div>
                                <div className={styles.formCol}>
                                    <div className={styles.formColHeader}>COVID Response Survey</div>
                                    <div className={styles.formQuestions}>
                                        <div className={styles.formQuestion}>Are your employees required to wear masks?</div>
                                        <Field className={styles.formInput} type='radio' id="male" name="gender"/>
                                        <label className={styles.formRadioLabel}>Yes</label>
                                        <Field className={styles.formInput} type='radio' id="female" name="gender" value="female"/>
                                        <label className={styles.formRadioLabel}>No</label> <br/><br/>
                                        <div className={styles.formQuestion}>Are your employees required to wear masks?</div>
                                    </div>
                                </div>
                            </div>
                            <Button style={{marginTop:'20px', marginRight: '40px', float:'right'}} type="submit">
                                Submit
                            </Button>
                        </Form>
                </Formik>
       {/*        <Form>
            <label>Location Name <br/><Field type="input" name="name"/> </label><br/>
            <label>Address Line 1 <br/><Field type="input" name="addr.line1"/> </label> <br/>
            <label>Address Line 2 <br/><Field type="input" name="addr.line2"/> </label> <br/>
            <label>City <br/><Field type="input" name="addr.city"/> </label> <br/>
            <label>State <br/><Field type="input" name="addr.state"/> </label> <br/>
            <label>Zip Code <br/><Field type="input" name="addr.zip"/> </label> <br/>
            <label>Location Type <br/><Field as="select" name="type" multiple={false}>
                <option value="restaurant">Restaurant</option>
                <option value="gym">Gym</option>
                <option value="other">Other</option>
            </Field> </label> <br/>
            <button type="submit" style={{marginTop: "8px"}}>Submit</button>
        </Form>*/}
            </div>
        );
    }
}

export default AddLocation;
