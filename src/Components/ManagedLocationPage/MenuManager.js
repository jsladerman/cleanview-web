import React, { Component } from 'react';
import styles from './css/MenuManager.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { API, Storage } from 'aws-amplify';
import Button from "react-bootstrap/Button";


class MenuManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu_link: '',
            switchVal: 'pdf',
            backendEnv: 'dev'
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
        if (menu_link === '' || menu_link === null) {
            return (
                <p>Right now, we don't have a menu for this location. Let's change that.</p>
            );
        } else {
            return (
                <div>
                    <div>
                        <div className={styles.textLine}>
                            <span>Your menu link right now is: {" "}</span>
                            <a id={styles.menuLink} rel="noopener noreferrer" href={this.state.menu_link} target="_blank">{this.state.menu_link}</a>
                        </div>
                        <div className={styles.textLine}>If that doesn't look right, change it below.</div>
                    </div>
                </div>
            );
        }
    }

    updateDataFromDB = async () => {
        const apiName = 'ManageLocationApi';
        const path = '/location/object'
        const requestData = {
            headers: {},
            response: true,
            queryStringParameters: {
                id: this.props.id
            }
        }

        API.get(apiName, path, requestData)
            .then(response => {
                if (response.data.body.menu_link) {
                    let currState = this.state
                    currState.menu_link = response.data.body.menu_link
                    currState.backendEnv = response.data.backendEnv
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
        const apiName = 'ManageLocationApi';
        const path = '/location/menu';
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
        return (
            <div className="container-fluid text-wrap" id={styles.menuManagerCodeBlock}>
                <h2 id={styles.menuManagerHeader}>Menu Manager</h2>

                <h4 className={styles.menuManagerSubheader}>Current Menu</h4>
                {this.titleText(this.state.menu_link)}

                {/* Using validate here because Formik has no 'OnChange field' */}

                <h4 className={styles.menuManagerSubheader}>Edit Menu</h4>
                <p className={styles.textLine}>After the customer takes the survey, they will be brought to the menu that you provide here.</p>

                <div id={styles.editMenuBox}>
                    <Formik validate={(values) => this.updateSwitchVal(values)}
                        initialValues={{
                            choice: this.state.switchVal
                        }}
                    >
                        <Form>
                            <span className={styles.textLine} style={{ marginRight: '10px' }}>How would you like to attach your menu? </span>
                            <Field as='select' name='choice'>
                                <option value="none">Remove link after survey</option>
                                <option value="pdf">Link to uploaded pdf</option>
                                <option value="url">Link to existing menu</option>
                            </Field>
                        </Form>
                    </Formik>
                    <InputSwitch value={this.state.switchVal}
                        loc_id={this.props.id}
                        handleChange={this.updateMenuURL}
                        menu_link={this.props.menu_link}
                        backendEnv={this.state.backendEnv}
                    />
                </div>
            </div>
        )
    }
}

class InputSwitch extends Component {
    render() {
        switch (this.props.value) {
            case 'url':
                return (
                    <URLMenuUpload handleChange={this.props.handleChange} menu_link={this.props.menu_link} />
                );
            case 'pdf':
                return (
                    <PDFMenuUpload loc_id={this.props.loc_id} handleChange={this.props.handleChange} backendEnv={this.props.backendEnv} />
                );
            default:
                return (
                    <div>
                        <div className={styles.textLine}>This button will delete the menu you have on file. Are you sure you want to press it?</div>
                        <Button className={styles.removeMenuButton} type="button" onClick={() => this.props.handleChange('')}>Yeah, I'm sure.</Button>
                    </div>
                );
        }
    }
}

class URLMenuUpload extends Component {
    render() {
        return (
            <div>
                <Formik onSubmit={(values) => this.props.handleChange(values.url)}
                    initialValues={{
                        url: this.props.menu_link
                    }}
                    validate={(values) => {
                        const errors = {}
                        if (!values.url) {
                            errors.url = 'Required'
                        } else if (!values.url.startsWith("https://")) {
                            errors.url = 'The link must start with "https://".'
                        }
                        return errors
                    }}>
                    <Form>
                        <label className={styles.textLine}>
                            Link to menu (URL): {" "}
                            <Field type="url" name="url" />
                            <ErrorMessage name="url" component="div" />
                        </label>
                        <div>
                            <button className={styles.menuManagerButton} type='submit'>Save</button>
                        </div>
                    </Form>
                </Formik>
            </div>
        );
    }
}

class PDFMenuUpload extends Component {

    uploadFile = async (e, handleChangeFunc) => {
        const file = e.target.files[0];
        const filename = this.props.loc_id + '.pdf'

        await Storage.put(filename, file, {
            level: 'public',
            contentDisposition: 'inline; filename="' + filename + '"',
            contentType: 'application/pdf'
        })
            .catch(err => console.log(err))

        Storage.get(filename)
            .then(resultURL => {
                const idx = resultURL.indexOf(filename)
                const url = resultURL.substring(0, idx) + '' + filename
                handleChangeFunc(url)
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div className={styles.textLine}>
                Upload a PDF: <input type="file" accept='.pdf' onChange={(evt) => this.uploadFile(evt, this.props.handleChange)} style={{ marginLeft: '10px', fontSize: '14px' }} />
            </div>
        );
    }
}

export default MenuManager;
