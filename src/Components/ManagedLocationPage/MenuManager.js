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
            switchVal: 'pdf',
            menus: [],
        }
    }

    componentDidMount() {
        this.updateDataFromDB()
    }

    render() {
        return (
            <div className="container-fluid text-wrap" id={styles.menuManagerCodeBlock}>
                <h2 id={styles.menuManagerHeader}>Menu Manager</h2>
                <h4 className={styles.menuManagerSubheader}>Add a new menu</h4>
                <AddNewMenu submitFunc={this.addMenu} id={this.props.id} menus={this.state.menus} />
                <h4 className={styles.menuManagerSubheader}>Current Menus</h4>
                <MenuTable menus={this.state.menus} loading={this.state.loading}/>
                <h4 className={styles.menuManagerSubheader}>Delete Menu</h4>
                <DeleteMenu menus={this.state.menus} deleteFunc={this.deleteMenu}/>
            </div>
        )
    }

    deleteMenu = (menuName) => {
        if(!window.confirm("Are you sure you want to delete this menu?"))
            return
        let currentMenus = this.state.menus
        for(let i=0; i<currentMenus.length; ++i) {
            if(currentMenus[i].name === menuName) {
                currentMenus.splice(i, 1)
                break
            }
        }
        this.updateMenus(currentMenus)
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
                this.setState(currState)
            })
            .catch(error => {
                console.log("Error: " + error)
            });
        
        this.setState({loading: false})
    }



    addMenu = (newMenuName, newMenuLink) => {
        let currentMenus = this.state.menus
        let newMenu = {
            name: newMenuName,
            url: newMenuLink
        }
        currentMenus.push(newMenu)
        this.updateMenus(currentMenus)
    }

    updateMenus = (currentMenus) => {
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
                this.updateDataFromDB()
                this.props.handleUpdate()
            })
            .catch(error => {
                console.log("Error: ", error)
                this.setState({ loading: false })
            })
    }
}

class DeleteMenu extends Component {
    render() {
        return(
            <div>
                <h4>Delete Menu</h4>
                <Formik
                initialValues={{
                    menuName: 'none'
                }}
                onSubmit={(values) => this.props.deleteFunc(values.menuName)}
                validate={(values) => {
                    let errors = {}
                    if(values.menuName === 'none')
                        errors.menuName = 'Please select a valid menu to delete.'

                    return errors
                }}
                >
                    <Form>
                        <Field as="select" name="menuName">
                            <option value='none'>Select</option>
                            {this.props.menus.map((menu) => {
                                return(
                                    <option value={menu.name} key={menu.name}>{menu.name}</option>
                                );
                            })}
                        </Field>
                        <Button variant="danger" type="submit">Delete</Button>
                    </Form>
                </Formik>
            </div>
        );
    }
}

class AddNewMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            submissionType: 'none',
            menuLink: '',
            loading: false
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

                        if(!this.state.menuLink) {
                            if (!values.url) {
                                errors.url = 'Required'
                            } else if (!values.url.startsWith("https://")) {
                                errors.url = 'The link must start with "https://".'
                            }
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
                        if(this.state.menuLink === '')
                            this.props.submitFunc(values.name, values.url)
                        else
                            this.props.submitFunc(values.name, this.state.menuLink)
                    }}
                >
                    <Form className={styles.newMenuGeneratorWrapper}>
                        <Row>
                            <Col className={styles.newMenuFormColumn}>
                            <div className="form-group" class="column-contents">
                                    <label className={styles.menuField}>Name</label>
                                    <Field type="input" name="name"></Field>
                                    
                                </div>
                            </Col>
                            <Col className={styles.newMenuFormColumn}>
                                <div className="form-group" class="column-contents">
                                    <label className={styles.menuField}>Type of Menu</label>
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
                            <Col className={styles.newMenuFormColumn}>
                                {this.button()}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ErrorMessage name="name" component="div" />    
                            </Col>
                            <Col>
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
                <Button className={styles.generateMenuSubmit} disabled>Add</Button>
            );
        } else if(this.state.loading) {
            return(
                <Button className={styles.generateMenuSubmit} disabled>Uploading file...</Button>
            );
        } else {
            return(
                <Button className={styles.generateMenuSubmit} type="submit">Add</Button>
            )
        }
    }

    uploadFile = async (e) => {
        this.setState({loading: true})
        const file = e.target.files[0];
        const filename = this.props.id + "STRL" + uuid() + '.pdf'
        await Storage.put(filename, file, {
            level: 'public',
            contentDisposition: 'inline; filename="' + filename + '"',
            contentType: 'application/pdf'
        })
            .catch(err => console.log(err))

        await Storage.get(filename)
            .then(resultURL => {
                const idx = resultURL.indexOf(filename)
                const url = resultURL.substring(0, idx) + '' + filename
                this.setState({ menuLink: url })
            })
            .catch(err => console.log(err))
        this.setState({loading: false})
    }
}

class MenuUploadSwitch extends Component {
    render() {
        switch (this.props.switchVal) {
            case 'pdf':
                return(
                    <div>
                       <Col className={styles.newMenuFormColumn}>
                       <div className="form-group" class="column-contents">
                            Upload a PDF: <input 
                                            type="file" 
                                            accept='.pdf' 
                                            onChange={(evt) => this.props.uploadFunc(evt)}/>
                            <Field type="hidden" name="url"></Field>
                            </div>
                       </Col> 
                    </div>
                );
            case 'link':
                return(
                    <div className="form-group" class="column-contents">
                       <Col className={styles.newMenuFormColumn}>
                            <label>Type existing URL here:</label>
                            <Field type="url" name="url"></Field>
                            
                       </Col> 
                    </div>
                );
            default:
                return(
                    <div className="form-group" class="column-contents">
                       <Col className={styles.newMenuFormColumn}>
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
                   </tr>
                </thead> 
                <tbody>
                    {this.props.menus.map((menu) => {
                        return(
                            <tr key={menu.name}>
                                <td>
                                    {menu.name}
                                </td>
                                <td>
                                    <a href={menu.url} target="_blank" rel="noopener noreferrer">{menu.url}</a>
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
