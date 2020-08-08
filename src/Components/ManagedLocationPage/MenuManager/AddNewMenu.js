import React, {Component} from 'react';
import styles from '../css/MenuManager.module.css';
import {Storage} from 'aws-amplify';
import {Formik, Form, Field, ErrorMessage, validateYupSchema} from 'formik';
import FormControl from 'react-bootstrap/FormControl'
import Button from "react-bootstrap/Button";
import uuid from 'react-uuid';

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
        return (
            <div>
                <Formik
                    initialValues={{
                        name: '',
                        type: 'none',
                        url: '',
                        lastName: ''
                    }}
                    validate={(values) => {
                        // Formik does't have onChange() so here I am
                        if (values.type !== this.state.submissionType) {
                            this.setState({submissionType: values.type})
                            this.setState({menuLink: ''})
                        }

                        //     let errors = {}
                        //     if (!values.name)
                        //         errors.name = "Please enter a valid menu name."
                        //
                        //     if (!this.state.menuLink) {
                        //         if (!values.url) {
                        //             errors.url = 'Required'
                        //         } else if (!values.url.startsWith("https://")) {
                        //             errors.url = 'The link must start with "https://".'
                        //         }
                        //     }
                        //
                        //     for (let i = 0; i < this.props.menus.length; ++i) {
                        //         if (values.name === this.props.menus[i].name) {
                        //             errors.name = "There already exists a menu with this name."
                        //             return errors
                        //         }
                        //     }
                        //     return errors
                    }}
                    onSubmit={(values) => {
                        console.log(values)
                        // if (this.state.menuLink === '')
                        //     this.props.submitFunc(values.name, values.url)
                        // else
                        //     this.props.submitFunc(values.name, this.state.menuLink)
                    }}
                >
                    <Form className={styles.newMenuGeneratorWrapper}>
                        <div className={styles.formCols}>
                            <div className={styles.formCol}>
                                <div className={styles.menuField}><strong>Name</strong></div>
                                <Field as={FormControl} className={styles.formControlInput} name='name'/>
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
                            </div>
                            <div className={styles.formCol}>
                                <div style={{marginTop: '16px'}}>
                                    {this.button()}
                                </div>
                            </div>
                            {/*<ErrorMessage name="name" component="div"/>*/}
                            {/*<ErrorMessage name="url" component="div"/>*/}
                        </div>
                    </Form>
                </Formik>
            </div>
        );
    }

    button = () => {
        if (this.state.submissionType === 'none') {
            return (
                <Button block={false} className={styles.generateMenuSubmit} disabled>Add</Button>
            );
        } else if (this.state.loading) {
            return (
                <Button block={false} className={styles.generateMenuSubmit} disabled>Uploading file...</Button>
            );
        } else {
            return (
                <Button block={false} className={styles.generateMenuSubmit} type="submit">Add</Button>
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
                this.setState({menuLink: url})
            })
            .catch(err => console.log(err))
        this.setState({loading: false})
    }

    menuUploadSwitch = (switchVal) => {
        switch (switchVal) {
            case 'pdf':
                return (
                    <div>
                        <input style={{maxWidth: '210px'}}
                               type="file"
                               accept='.pdf'
                               onChange={(evt) => this.props.uploadFunc(evt)}/>
                        <Field type="hidden" name="url"/>
                    </div>
                );
            case 'link':
                return (
                    <div>
                        <Field as={FormControl}
                               placeholder='e.g. https://myshop.com/menu'
                               className={styles.formControlInput}
                               name='url'/>
                    </div>
                );
            default:
                return (
                    <div>
                        No menu type selected.
                    </div>
                );
        }
    }
}

export default AddNewMenu;
