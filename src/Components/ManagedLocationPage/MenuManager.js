import React, { Component } from 'react';
import styles from './css/MenuManager.module.css';
import { Formik, Form, Field, ErrorMessage, validateYupSchema } from 'formik';
import { API, Storage } from 'aws-amplify';
import Button from "react-bootstrap/Button";
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import uuid from 'react-uuid';


class MenuManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            menu_link: '',
            switchVal: 'pdf',
            menus: []
        }

        // this.updateDataFromDB = this.updateDataFromDB.bind(this)
    }

    componentDidMount() {
        this.updateDataFromDB()
    }

    render() {
        return (
            <div className="container-fluid text-wrap" id={styles.menuManagerCodeBlock}>    
                <h2 id={styles.menuManagerHeader}>Menu Manager</h2>
                <h4 className={styles.menuManagerSubheader}>Add a new menu</h4>
                <AddNewMenu submitFunc={this.updateMenus} id={this.props.id} menus={this.state.menus}/>
                <h4 className={styles.menuManagerSubheader}>Current Menus</h4>
                <MenuTable menus={this.state.menus} loading={this.state.loading}/>
            </div>
        )
    }

    updateDataFromDB = () => {
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
                if(!response.data.body.menus)
                    return
                let currState = this.state
                currState.menus = response.data.body.menus
                currState.loading = false
                this.setState(currState)
            })
            .catch(error => {
                console.log("Error: " + error)
            });
    }

    // updateMenuURL = async (urlVal) => {
    //     const apiName = 'ManageLocationApi';
    //     const path = '/location/menu';
    //     const requestData = {
    //         headers: {},
    //         response: true,
    //         body: {
    //             menu_link: urlVal,
    //             loc_id: this.props.id
    //         },
    //     }

    //     API.patch(apiName, path, requestData)
    //         .then(response => {
    //             this.updateDataFromDB()
    //         })
    //         .catch(error => {
    //             console.log("Error: " + error)
    //         })

    // }

    updateMenus = (newMenuVals, newMenuLink) => {

        let currentMenus = this.state.menus
        let newMenu = {
            name: newMenuVals.name,
            url: newMenuLink
        }
        currentMenus.push(newMenu)

        const apiName = 'ManageLocationApi'
        const path = '/location/menu'
        const requestData = {
            headers: {},
            response: true,
            body: {
                menus: currentMenus,
                id: this.props.id
            }
        }

        this.setState({ loading: true })
        API.patch(apiName, path, requestData)
            .then(response => {
                console.log(response)
                this.updateDataFromDB()
            })
            .catch(error => {
                console.log("Error: error")
                this.setState({ loading: false })
            })
    }
}

class AddNewMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            submissionType: 'none',
            menuLink: ''
        }
    }

    render() {
        return(
            <div>
                <Formik
                    initialValues={{
                        name: '',
                        type: 'none',
                        url: '',
                    }}
                    validate={(values) => {
                        // Formik does't have onChange() so here I am
                        if(values.type !== this.state.submissionType) {
                            this.setState({ submissionType: values.type })
                            this.setState({ menuLink: '' })
                        }
                        
                        let errors = {}
                        if(!values.name)
                            errors.name = "Please enter a valid menu name."

                        if (!values.url) {
                            errors.url = 'Required'
                        } else if (!values.url.startsWith("https://")) {
                                errors.url = 'The link must start with "https://".'
                        }

                        for(let i=0; i<this.props.menus.length; ++i) {
                            if(values.name === this.props.menus[i].name) {
                                errors.name = "There already exists a menu with this name."
                                return errors
                            }                            
                        }
                        return errors
                    }}
                    onSubmit={(values) => {
                        console.log('hey')
                        if(this.state.menuLink === '')
                            this.props.submitFunc(values, values.url)
                        else
                            this.props.submitFunc(values, this.state.menuLink)
                    }}
                >
                    <Form>
                        <Row>
                            <Col>
                                <div>
                                    <label>Name</label>
                                    <Field type="input" name="name"></Field>
                                    <ErrorMessage name="name" component="div" />
                                </div>
                            </Col>
                            <Col>
                                <div>
                                    <label>Type of Menu</label>
                                    <Field as="select" name="type">
                                        <option value='none'>Select</option>
                                        <option value='pdf'>PDF Upload</option>
                                        <option value='link'>Existing online menu</option>
                                    </Field>
                                </div>
                            </Col>
                            <MenuUploadSwitch 
                                switchVal={this.state.submissionType} 
                                url={this.state.menuLink}
                                uploadFunc={this.uploadFile}
                                />
                            <Col>
                                {this.button()}
                            </Col>
                        </Row>
                    </Form>
                </Formik>
            </div>
        );
    }

    button = () => {
        if(this.state.submissionType === 'none'){
            return(
                <Button disabled>Add</Button>
            );
        } else {
            return(
                <Button type="submit">Add</Button>
            )
        }
    }

    uploadFile = async (e) => {
        const file = e.target.files[0];
        const filename = this.props.id + "STRL" + uuid() + '.pdf'
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
                this.setState({ menuLink: url })
            })
            .catch(err => console.log(err))
    }
}

class MenuUploadSwitch extends Component {
    render() {
        switch (this.props.switchVal) {
            case 'pdf':
                return(
                    <div>
                       <Col>
                            <div>
                            Upload a PDF: <input 
                                            type="file" 
                                            accept='.pdf' 
                                            onChange={(evt) => this.props.uploadFunc(evt)}/>
                            </div>
                       </Col> 
                    </div>
                );
            case 'link':
                return(
                    <div>
                       <Col>
                            <label>Type existing URL here:</label>
                            <Field type="url" name="url"></Field>
                            <ErrorMessage name="url" component="div" />
                       </Col> 
                    </div>
                );
            default:
                return(
                    <div>
                       <Col>
                       No menu type selected.
                       </Col> 
                    </div>
                );
        }
    }
}

class MenuTable extends Component {
    render() {
        if(this.props.loading) {
            return(
                <div>Loading...</div>
            );
        }
        if(this.props.menus.length === 0)
            return(
                <div>
                    <h5>You don't have any menus right now :)</h5>
                </div>
            );
        
        return(
            <Table striped bordered hover>
               <thead>
                   <tr>
                       <th>
                           Name
                       </th>
                       <th>
                            Link
                       </th>
                       <th>
                           Edit
                       </th>
                   </tr>
                </thead> 
                <tbody>
                    {this.props.menus.map((menu) => {
                        return(
                            <tr>
                                <td>
                                    {menu.name}
                                </td>
                                <td>
                                    <a href={menu.url} target="_blank" rel="noopener noreferrer">{menu.url}</a>
                                </td>
                                <td>
                                    <Button>Edit</Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }
}

export default MenuManager;
