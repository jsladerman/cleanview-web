import React, {Component} from 'react';
import styles from '../css/MenuManager.module.css';
import {Formik, Form, Field, ErrorMessage, validateYupSchema} from 'formik';
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

class DeleteMenu extends Component {
    render() {
        return (
            <div className={styles.deleteMenuGeneratorWrapper}>
                <div className={styles.menuField}><strong>Select a menu to delete</strong></div>
                <Formik
                    initialValues={{
                        menuName: 'none'
                    }}
                    onSubmit={(values) => this.props.deleteFunc(values.menuName)}
                    validate={(values) => {
                        let errors = {}
                        if (values.menuName === 'none')
                            errors.menuName = 'Please select a valid menu to delete.'

                        return errors
                    }}
                >
                    <Form>
                        <div className={styles.formCols}>
                            <div className={styles.formCol}>
                                <Field name='menuName' className={styles.deleteField}>
                                    {({field, form: {touched, errors}}) => (
                                        <FormControl as='select'
                                                     style={{width: '300px'}}
                                                     {...field}>
                                            <option value='none'>Select</option>
                                            {this.props.menus.map((menu) => {
                                                return (
                                                    <option value={menu.name} key={menu.name}>{menu.name}</option>
                                                );
                                            })}
                                        </FormControl>
                                    )}
                                </Field>
                            </div>
                            <div className={styles.formCol}>
                                <Button className={styles.menuDeleteBtn} variant="danger" type="submit">Delete</Button>
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        );
    }
}

export default DeleteMenu;
