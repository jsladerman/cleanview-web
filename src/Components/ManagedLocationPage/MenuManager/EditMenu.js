import React, {Component} from 'react'
import styles from '../css/MenuManager.module.css';
import {Formik, Form, Field, ErrorMessage, validateYupSchema} from 'formik'
import FormControl from 'react-bootstrap/FormControl'
import Button from "react-bootstrap/Button"
import uuid from 'react-uuid'
import {API, Storage} from "aws-amplify";

class EditMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: this.props.menu,
            submissionType: 'none',
            menuLink: '',
            loading: false,
            menuUploaded: false
        }
    }

    render() {
        return(
            <div>
                <h2 className={styles.editMenuTitleText}>
                    <div> Editing: {this.props.menu.name} </div>
                    <div> Current Menu Link: {this.props.menu.url} </div>
                </h2>
                <Formik
                    initialValues={{
                        name: this.props.menu.name,
                        type: 'none',
                        url: this.props.menu.url,
                    }}
                    validate={(values) => {
                        if (values.type !== this.state.submissionType) {
                            this.setState({submissionType: values.type})
                            this.setState({menuLink: ''})
                        }
                        let errors = {}
                        if (!values.name)
                            errors.name = "Please enter a valid menu name."

                        if (!this.state.menuLink) {
                            if (!values.url) {
                                errors.url = 'Required'
                            } else if (!values.url.startsWith("https://")) {
                                errors.url = 'URL must start with "https://".'
                            }
                        }

                        for (let i = 0; i < this.props.currentMenus.length; ++i) {
                            if (values.name === this.props.currentMenus[i].name && values.name !== this.props.menu.name) {
                                errors.name = "There already exists a menu with this name."
                                return errors
                            }
                        }
                        if (values.type !== 'link')
                            errors = {}
                        return errors
                    }}
                    onSubmit={(values) => this.onSubmit(values)}>
                    <Form className={styles.editMenuWrapper}>
                        <div className={styles.formCols}>
                            <div className={styles.formCol}>
                                <div className={styles.menuField}><strong>Name</strong></div>
                                <Field as={FormControl} className={styles.formControlInput} name='name'/>
                                <ErrorMessage name='name' className={styles.errorMsg} component='div'/>
                            </div>
                            <div className={styles.formCol}>
                                <div className={styles.menuField}><strong>Type of Menu</strong></div>
                                <Field name='type'>
                                    {({field, form: {touched, errors}}) => (
                                        <FormControl as='select' className={styles.formControlInput} {...field}>
                                            <option value='none'>Select</option>
                                            <option value='pdf'>PDF Upload</option>
                                            <option value='link'>Existing online menu</option>
                                        </FormControl>
                                    )}
                                </Field>
                            </div>
                            <div className={styles.formCol}>
                                <div className={styles.menuField}><strong>Menu Upload</strong></div>
                                {this.menuUploadSwitch(this.state.submissionType)}
                                <ErrorMessage name='url' className={styles.errorMsg} component='div'/>
                            </div>
                            <div className={styles.formCol}>
                                <div style={{marginTop: '16px'}}>
                                    {this.button()}
                                </div>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        );
    }

    button = () => {
        if (this.state.submissionType === 'none') {
            return (
                <Button block={false} className={styles.generateMenuSubmit} disabled>Edit</Button>
            );
        } else if (this.state.loading) {
            return (
                <Button block={false} className={styles.generateMenuSubmit} disabled>Uploading file...</Button>
            );
        } else if (this.state.submissionType === 'pdf' && !this.state.menuUploaded && !this.state.loading) {
            return (
                <Button block={false} className={styles.generateMenuSubmit} disabled>Edit</Button>
            );
        } else {
            return (
                <Button block={false} className={styles.generateMenuSubmit} type="submit">Edit</Button>
            )
        }
    }

    menuUploadSwitch = (switchVal) => {
        switch (switchVal) {
            case 'pdf':
                return (
                    <div>
                        <input style={{maxWidth: '210px'}}
                               type="file"
                               accept='.pdf'
                               onChange={(evt) => this.uploadFile(evt)}/>
                        <Field type="hidden" name="url"/>
                    </div>
                );
            case 'link':
                if (this.state.menuUploaded)
                    this.setState({menuUploaded: false})
                return (
                    <div>
                        <Field as={FormControl}
                               placeholder='e.g. https://myshop.com/menu'
                               className={styles.formControlInput}
                               name='url'/>
                    </div>
                );
            default:
                if (this.state.menuUploaded)
                    this.setState({menuUploaded: false})
                return (
                    <div>
                        No menu type selected.
                    </div>
                );
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
                this.setState({menuLink: url})
            })
            .catch(err => console.log(err))
        this.setState({menuUploaded: true, loading: false})
    }

    onSubmit = (values) => {
        console.log("Values", values)
        const newLink = this.state.menuLink === '' ? values.url : this.state.menuLink
        const newName = values.name
        const newId = this.props.menu.id

        let currentMenus = this.props.currentMenus
        console.log("Before", currentMenus)
        for(let i=0; i<currentMenus.length; ++i) {
            if(currentMenus[i].id === newId)
                currentMenus[i] = {
                    name: newName,
                    url: newLink,
                    id: newId
                }
        }
        console.log("After", currentMenus)
        this.props.updateFunc(currentMenus)
        this.props.toggleFunc()
    }
}

export default EditMenu;

