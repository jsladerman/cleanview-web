import React, {Component} from 'react';
import {Formik, Form, Field} from 'formik';
import {API, Storage} from 'aws-amplify';


class MenuManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loc_id: '4323841-865-8664-ce7a-f32b7b13dcbd',
            menu_link: '',
            titleText: "Right now, we don't have a menu for this location. Let's change that."
        }
        this.updateTitleText = this.updateTitleText.bind(this);
        this.updateMenuURL = this.updateMenuURL.bind(this);
        this.getData = this.getData.bind(this)
    }

    componentDidMount() {
        this.updateTitleText()
    }

    getData = async () => {
        const apiName = 'manageLocationApi';
        const path = '/manageLocation/object'
        const requestData = {
            headers: {},
            response: true,
            queryStringParameters: {
                id: this.state.loc_id
            }
        }

        API.get(apiName, path, requestData)
            .then(response => {
                console.log(response)
                if(response.data.body.menu_link) {
                    let currState = this.state
                    currState.menu_link = response.data.body.menu_link
                    this.setState(currState)
                }
            })
            .catch(error => {
                console.log("Error: " + error)
            });
    }

    updateTitleText() {
        this.getData()

        if (this.state.menu_link !== '') {
            let currState = this.state
            currState.titleText = "Your menu link right now is: " + this.state.menu_link + ". If that doesn't look right, change it below."
            this.setState(currState)
        }

    }

    updateMenuURL = async (values) => {
        const apiName = 'manageLocationApi';
        const path = '/manageLocation';
        const requestData = {
            headers: {},
            response: true,
            body: {
                menu_link: values.url,
                loc_id: this.state.loc_id
            },
        };

        API.patch(apiName, path, requestData)
            .then(response => {
                console.log("Update successful: " + response.body);
                this.updateTitleText()
            })
            .catch(error => {
                console.log("Error: " + error)
            })
        
    }

    uploadFile = (e) => {
        const file = e.target.files[0];
        const filename = this.state.loc_id + '.pdf'
        Storage.put( filename, file, {
            level: 'public',
            contentDisposition: 'inline; filename="' + filename + '"',
            contentType: 'application/pdf'
        })
        .then(result => console.log(result))
        .catch(err => console.log(err))
    }

    // Ideal Structure
    // Display what menu link is there right now

    // TODO: Radio buttons for selection
    // Want to use a different menu?
    // Put in link here
    // OR
    // Upload this PDF

    render() {
        return(
            <div>
                <h2>{this.state.titleText}</h2>
                <Formik onSubmit={(values) => this.updateMenuURL(values)}
                    initialValues = {{
                        url: ''
                    }}
                >
                    <Form>
                        
                        <Field as='select' name='choice'>
                            <option value="none">No menu</option>
                            <option value="pdf">Uploaded PDF menu</option>
                            <option value="link">Link to existing menu</option>
                        </Field>
                    <div>
                        <label>
                            Put ya website in
                            <Field type="url" name="url"></Field>
                        </label>
                    <div>
                    <div>
                        <Field type="file">Submit file</Field>
                    </div>
                    </div>
                        <button type="submit" style={{marginTop: "8px"}}>Submit</button>
                        </div>
                    </Form>
                </Formik>
                <br />
                <br />
                <input
              type="file" accept='.pdf'
              onChange={(evt) => this.uploadFile(evt)}
          />
            </div>
        )
    }
}

export default MenuManager;