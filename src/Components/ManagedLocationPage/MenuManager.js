import React, {Component} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {API, Storage} from 'aws-amplify';


class MenuManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu_link: '',
            switchVal: 'pdf'
        }

        this.updateMenuURL = this.updateMenuURL.bind(this);
        this.updateSwitchVal = this.updateSwitchVal.bind(this)
        this.updateDataFromDB = this.updateDataFromDB.bind(this)
        this.titleText = this.titleText.bind(this)
    }

    componentDidMount() {
        this.updateDataFromDB()
    }

    titleText = (menu_link) => {
        if(menu_link === ''|| menu_link === null) {
            return(
                <h1>Right now, we don't have a menu for this location. Let's change that.</h1>
            );
        } else {
            return(
                <h2>
                    <div>
                        Your menu link right now is: {" "}
                        <a rel="noopener noreferrer" href={this.state.menu_link} target="_blank">{this.state.menu_link}</a>
                    </div>
                    <div>
                        If that doesn't look right, change it below.
                    </div>
                </h2>
            );
        }
    }

    updateDataFromDB = async () => {
        const apiName = 'manageLocationApi';
        const path = '/manageLocation/object'
        const requestData = {
            headers: {},
            response: true,
            queryStringParameters: {
                id: this.props.id
            }
        }

        API.get(apiName, path, requestData)
            .then(response => {
                if(response.data.body.menu_link) {
                    let currState = this.state
                    currState.menu_link = response.data.body.menu_link
                    this.setState(currState)
                } else {
                    let currState = this.state
                    currState.menu_link = ''
                    this.setState(currState)
                }
            })
            .catch(error => {
                console.log("Error: " + error)
            });
    }

    updateMenuURL = async (urlVal) => {
        const apiName = 'manageLocationApi';
        const path = '/manageLocation';
        const requestData = {
            headers: {},
            response: true,
            body: {
                menu_link: urlVal,
                loc_id: this.props.id
            },
        }

        API.patch(apiName, path, requestData)
            .then(response => {
                console.log("Update successful");
                this.updateDataFromDB()
            })
            .catch(error => {
                console.log("Error: " + error)
            })

    }

    updateSwitchVal = (values) => {
        let currState = this.state;
        currState.switchVal = values.choice
        this.setState(currState);
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
            {this.titleText(this.state.menu_link)}

            {/* Using validate here because Formik has no 'OnChange field' */}
            <Formik validate = { (values) => this.updateSwitchVal(values) }
                    initialValues = {{
                        choice: this.state.switchVal
                    }}
                    >
                <Form>
                    <Field as='select' name='choice' >
                        <option value="none">No menu</option>
                        <option value="pdf">Uploaded PDF menu</option>
                        <option value="url">Link to existing menu</option>
                    </Field>
                </Form>
            </Formik>
            <br />
            <br />
            <InputSwitch    value= {this.state.switchVal}
                            loc_id= {this.props.id}
                            handleChange={this.updateMenuURL}
                            menu_link = {this.props.menu_link}
            />
        </div>
        )
    }
}

class InputSwitch extends Component {
    render() {
       switch(this.props.value) {
           case 'url':
               return(
                   <URLMenuUpload handleChange={this.props.handleChange} menu_link={this.props.menu_link}/>
               );
            case 'pdf':
                return (
                    <PDFMenuUpload loc_id={this.props.loc_id} handleChange={this.props.handleChange} />
                );
            default:
                return(
                    <div>
                        This button will delete the menu you have on file.
                        Are you sure you want to press it?
                        <br/>
                        <button type="button" onClick={() => this.props.handleChange('')}>Yeah, I'm sure.</button>
                    </div>
                );
       }
    }
}

class URLMenuUpload extends Component {
    render() {
        return(
            <div>
                <Formik onSubmit={(values) => this.props.handleChange(values.url)}
                initialValues = {{
                    url: this.props.menu_link
                }}
                validate={(values) => {
                    const errors = {}
                    if(!values.url) {
                        errors.url = 'Required'
                    } else if (!values.url.startsWith("https://")) {
                        errors.url = 'The link must start with "https://".'
                    }
                    return errors
                }}>
                    <Form>
                        <label>
                            Put ya website in: {" "}
                            <Field type="url" name="url"></Field>
                            <ErrorMessage name="url" component="div"/>
                        </label>
                        <div>
                            <button type='submit'>Save</button>
                        </div>
                    </Form>
                </Formik>
            </div>
        );
    }
}

class PDFMenuUpload extends Component {

    uploadFile = (e, handleChangeFunc) => {
        const file = e.target.files[0];
        const filename = this.props.loc_id + '.pdf'
        Storage.put( filename, file, {
            level: 'public',
            contentDisposition: 'inline; filename="' + filename + '"',
            contentType: 'application/pdf'
        })
        .then(result => console.log(result))
        .catch(err => console.log(err))

        // TODO: CHANGE ON DEV VS PROD
        const url = "https://cleanview-menu-images200726-dev.s3.amazonaws.com/public/" + filename;
        handleChangeFunc(url)
    }

    render() {
        return(
            <div>
                <input type="file" accept='.pdf' onChange={ (evt) => this.uploadFile(evt, this.props.handleChange)}/>
            </div>
        );
    }
}

export default MenuManager;
