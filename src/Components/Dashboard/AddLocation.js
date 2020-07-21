import React, {Component} from 'react';
import styles from './css/AddLocation.css'
import {API} from 'aws-amplify';
import Auth from "@aws-amplify/auth"
import uuid from 'react-uuid';
import {Formik, Form, Field} from 'formik';


class AddLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
    }

    makeLocation = async (values) => {
        const apiName = 'manageLocationApi'; // replace this with your api name.
        const path = '/manageLocation'; //replace this with the path you have configured on your API
        const requestData = {
            body: {
                id: uuid(),
                loc_name: values.name,
                manager: await Auth.currentAuthenticatedUser()
                    .then(user => user["username"])
                    .catch(error => console.log("Error: " + error)),
                addr_line_1: values.addr.line1,
                addr_line_2: values.addr.line2,
                addr_city: values.addr.city,
                addr_state: values.addr.state,
                loc_type: values.type,
                survey_link: "google.com",
                subscription_status: "free_trial",
                subscription_end_date: "09/01/2020",
                cleaning_practices: {
                    employee_masks: 1,
                    social_distancing: 1,
                    dining_in: 0
                },
                is_confirmed: 0
            },
            headers: {} // OPTIONAL;
        };

        API.post(apiName, path, requestData)
            .then(response => {
                console.log("Location Add Successful: " + response);
                this.props.modalFunc();
            })
            .catch(error => {
                console.log("Error: " + error)
            })
    };

    render() {
        return (
            <div className="form">
                <Formik onSubmit={(values) => this.makeLocation(values)}
                        initialValues={{
                            name: '',
                            addr: {
                                line1: '',
                                line2: '',
                                city: '',
                                state: '',
                                zip: ''
                            },
                            type: 'restaurant'
                        }}>
                    <Form>
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
                    </Form>
                </Formik>
            </div>

        );
    }
}

export default AddLocation;
