import React, {Component} from 'react';
import {API, Storage} from 'aws-amplify';
import {Field, Form, Formik, getIn} from 'formik';
import styles from './css/EditLocationInfo.module.css';
import Button from 'react-bootstrap/Button';
import NumberFormat from 'react-number-format';
import {FormControl} from 'react-bootstrap';
import {string, object, number} from 'yup';

class EditLocationInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            imageUrl: this.props.data.imageUrl,
            imageLoading: false,
            noOutdoorSeating: this.props.data.covidResponseSurvey.outsideSeating === 'n',
        };
    }

    render() {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const zipRegex = /^[0-9]{5}$/;
        const phoneRegex = /^(?:\+?1]?)\s\(?([0-9]{3})\)\s[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;
        const yup = require('yup');
        const editLocationSchema = yup.object({
            businessName: yup.string().required(),
            businessType: yup.string().required(),
            businessEmail: yup.string().matches(emailRegex).required(),
            businessPhoneNum: yup.string().matches(phoneRegex).required(),
            addr: yup.object({
                line1: yup.string().required(),
                city: yup.string().required(),
                state: yup.string().required(),
                zip: yup.string().matches(zipRegex).required()
            }),
            employeeMasks: yup.string().required(),
            employeeTemp: yup.string().required(),
            socialDistance: yup.string().required(),
            sanitizeTables: yup.string().required(),
            outsideSeating: yup.string().required(),
            indoorCapacity: yup.number().required(),
            outdoorCapacity: yup.number()
                .when('outsideSeating', {
                    is: 'y',
                    then: yup.number().required()
                })

        });
        return (
            <div className={styles.editLocation}>
                <div className={styles.editLocationHeader}>Edit Location</div>
                <Formik
                    initialValues={{
                        businessName: this.state.data.loc_name,
                        businessType: this.state.data.loc_type,
                        businessEmail: this.state.data.email,
                        businessPhoneNum: this.unformatPhoneNum(this.state.data.phone),
                        addr: {
                            line1: this.state.data.addrLine1,
                            line2: this.state.data.addrLine2,
                            city: this.state.data.addrCity,
                            state: this.state.data.addrState,
                            zip: this.state.data.addrZip,
                        },
                        employeeMasks: this.state.data.covidResponseSurvey.employeeMasks,
                        employeeTemp: this.state.data.covidResponseSurvey.employeeTemp,
                        socialDistance: this.state.data.covidResponseSurvey.socialDistancing,
                        sanitizeTables: this.state.data.covidResponseSurvey.sanitizeTables,
                        outsideSeating: this.state.data.covidResponseSurvey.outsideSeating,
                        indoorCapacity: this.state.data.covidResponseSurvey.indoorCapacity,
                        outdoorCapacity: this.state.data.covidResponseSurvey.outdoorCapacity
                    }}
                    validationSchema={editLocationSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={this.editLocation}
                >
                    {({errors, isValid}) => (
                        <Form className={styles.form}>
                            <div className={styles.formCols}>
                                <div className={styles.formCol}>
                                    <div className={styles.formColHeader}>General Information</div>
                                    <div className={styles.formLabel}>Business Name</div>
                                    <Field
                                        className={styles.formInput}
                                        as={FormControl}
                                        name='businessName'
                                        style={errors.businessName ?
                                            (editLocationInputErrorStyle) : null}
                                    />
                                    <div className={styles.formLabel}>Business Type</div>
                                    <Field
                                        as='select'
                                        className={styles.formInput}
                                        name='businessType'
                                        style={errors.businessType ?
                                            (editLocationInputErrorStyle) : null}
                                    >
                                        <option value=''/>
                                        <option value='restaurant'>Restaurant</option>
                                        <option value='other'>Other</option>
                                    </Field>
                                    <div className={styles.formLabel}>Business Email</div>
                                    <Field
                                        className={styles.formInput}
                                        as={FormControl}
                                        name='businessEmail'
                                        style={errors.businessEmail ?
                                            (editLocationInputErrorStyle) : null}/>
                                    <div className={styles.formLabel}>Business Phone #</div>
                                    <Field name='businessPhoneNum' className={styles.formInput}>
                                        {({field}) => (
                                            <NumberFormat name='businessPhoneNum'
                                                          {...field}
                                                          className={styles.formInput}
                                                          format='+1 (###) ###-####'
                                                          allowEmptyFormatting mask='_'
                                                          customInput={FormControl}
                                                          style={errors.businessPhoneNum ?
                                                              (editLocationInputErrorStyle) : null}/>
                                        )}
                                    </Field>
                                </div>
                                <div className={styles.formCol}>
                                    <div className={styles.formColHeader}>Business Address</div>
                                    <div className={styles.formLabel}>Street</div>
                                    <Field
                                        className={styles.formInput}
                                        as={FormControl}
                                        name='addr.line1'
                                        style={getIn(errors, 'addr.line1') ?
                                            (editLocationInputErrorStyle) : null}
                                    />
                                    <div className={styles.formLabel}>Apt, Suite, etc.</div>
                                    <Field
                                        className={styles.formInput}
                                        as={FormControl}
                                        name='addr.line2'
                                    />
                                    <div className={styles.formLabel}>City</div>
                                    <Field
                                        className={styles.formInput}
                                        as={FormControl}
                                        name='addr.city'
                                        style={getIn(errors, 'addr.city') ?
                                            (editLocationInputErrorStyle) : null}
                                    />
                                    <div
                                        style={{width: '40%', float: 'left', marginRight: '12px'}}
                                    >
                                        <div className={styles.formLabel}>State</div>
                                        {this.renderStateDropdown(getIn(errors, 'addr.state'))}
                                    </div>
                                    <div style={{width: '50%', float: 'left'}}>
                                        <div className={styles.formLabel}>Zip Code</div>
                                        <Field
                                            className={styles.formInput}
                                            maxLength={5}
                                            as={FormControl}
                                            name='addr.zip'
                                            style={getIn(errors, 'addr.zip') ?
                                                (Object.assign({},
                                                    editLocationInputErrorStyle,
                                                    {width: '100%'})) : {width: '100%'}}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formCol}>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        style={{display: 'none'}}
                                        ref={(ref) => (this.upload = ref)}
                                        onChange={(evt) => this.uploadFile(evt)}
                                    />
                                    <img
                                        src={require('../../images/addLocationCamera.svg')}
                                        alt=''
                                        height='50px'
                                        style={{
                                            cursor: 'pointer',
                                            float: 'right',
                                            marginTop: '-16px',
                                        }}
                                        onClick={() => {
                                            this.upload.click();
                                        }}
                                    />
                                    <div className={styles.formColHeader}>Upload Image:</div>
                                    <div className={styles.imageLabel}>Example scaled image:</div>
                                    <img
                                        src={this.state.imageUrl}
                                        alt=''
                                        style={{
                                            borderRadius: '8px',
                                            width: '250px',
                                            height: '160px',
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={styles.surveyBox}>
                                {isValid ? null :
                                    <div className={styles.validationErrorMsg}>
                                        Please fill in all required values.
                                    </div>}
                                <br/>
                                <div className={styles.formColHeader}>COVID Response Survey</div>
                                <div className={styles.formQuestions}>
                                    <div className={styles.formQuestionsCols}>
                                        <div className={styles.formQuestionsCol}>
                                            <div style={errors.employeeMasks ?
                                                ({color: 'red'}) : null}>
                                                <div className={styles.formRadioQuestion}>
                                                    Are your employees required to wear masks?
                                                </div>
                                                <label className={styles.customRadioBtnContainer}>
                                                    <Field type='radio' name='employeeMasks' value='y'/>
                                                    <div className={styles.formRadioBtn}/>
                                                </label>
                                                <label className={styles.formRadioLabel}>Yes</label>
                                                <label className={styles.customRadioBtnContainer}>
                                                    <Field type='radio' name='employeeMasks' value='n'/>
                                                    <div className={styles.formRadioBtn}/>
                                                </label>
                                                <label className={styles.formRadioLabel}>No</label> <br/>
                                                <br/>
                                            </div>
                                            <div style={errors.employeeTemp ?
                                                ({color: 'red'}) : null}>
                                                <div className={styles.formRadioQuestion}>
                                                    Do you take the temperature of your employees every day?
                                                </div>
                                                <label className={styles.customRadioBtnContainer}>
                                                    <Field type='radio' name='employeeTemp' value='y'/>
                                                    <div className={styles.formRadioBtn}/>
                                                </label>
                                                <label className={styles.formRadioLabel}>Yes</label>
                                                <label className={styles.customRadioBtnContainer}>
                                                    <Field type='radio' name='employeeTemp' value='n'/>
                                                    <div className={styles.formRadioBtn}/>
                                                </label>
                                                <label className={styles.formRadioLabel}>No</label> <br/>
                                                <br/>
                                            </div>
                                        </div>
                                        <div className={styles.formQuestionsCol}>
                                            <div style={errors.socialDistance ?
                                                ({color: 'red'}) : null}>
                                                <div className={styles.formRadioQuestion}>
                                                    Do you enforce social distancing guidelines?
                                                </div>
                                                <label className={styles.customRadioBtnContainer}>
                                                    <Field type='radio' name='socialDistance' value='y'/>
                                                    <div className={styles.formRadioBtn}/>
                                                </label>
                                                <label className={styles.formRadioLabel}>Yes</label>
                                                <label className={styles.customRadioBtnContainer}>
                                                    <Field type='radio' name='socialDistance' value='n'/>
                                                    <div className={styles.formRadioBtn}/>
                                                </label>
                                                <label className={styles.formRadioLabel}>No</label> <br/>
                                                <br/>
                                            </div>
                                            <div style={errors.outsideSeating ?
                                                ({color: 'red'}) : null}>
                                                <div className={styles.formRadioQuestion}>
                                                    Do you have outside seating?
                                                </div>
                                                <label className={styles.customRadioBtnContainer}>
                                                    <Field
                                                        type='radio'
                                                        name='outsideSeating'
                                                        value='y'
                                                        onClick={() =>
                                                            this.setState({noOutdoorSeating: false})
                                                        }
                                                    />
                                                    <div className={styles.formRadioBtn}/>
                                                </label>
                                                <label className={styles.formRadioLabel}>Yes</label>
                                                <label className={styles.customRadioBtnContainer}>
                                                    <Field
                                                        type='radio'
                                                        name='outsideSeating'
                                                        value='n'
                                                        onClick={() =>
                                                            this.setState({noOutdoorSeating: true})
                                                        }
                                                    />
                                                    <div className={styles.formRadioBtn}/>
                                                </label>
                                                <label className={styles.formRadioLabel}>No</label> <br/>
                                                <br/>
                                            </div>
                                        </div>
                                        <div className={styles.formQuestionsCol}>
                                            <div style={errors.sanitizeTables ?
                                                ({color: 'red'}) : null}>
                                                <div className={styles.formRadioQuestion}>
                                                    Do you sanitize tables after every meal?
                                                </div>
                                                <label className={styles.customRadioBtnContainer}>
                                                    <Field type='radio' name='sanitizeTables' value='y'/>
                                                    <div className={styles.formRadioBtn}/>
                                                </label>
                                                <label className={styles.formRadioLabel}>Yes</label>
                                                <label className={styles.customRadioBtnContainer}>
                                                    <Field type='radio' name='sanitizeTables' value='n'/>
                                                    <div className={styles.formRadioBtn}/>
                                                </label>
                                                <label className={styles.formRadioLabel}>No</label> <br/>
                                                <br/>
                                            </div>
                                            <div>
                                                <div className={styles.formRadioQuestion}
                                                     style={errors.outdoorCapacity || errors.indoorCapacity ?
                                                         ({color: 'red'}) : null}>Capacity:
                                                </div>
                                                <br/>
                                                <div
                                                    style={{
                                                        float: 'left',
                                                        marginLeft: '8px',
                                                        marginRight: '16px',
                                                    }}
                                                >
                                                    <Field
                                                        className={styles.formNum}
                                                        type='number'
                                                        name='outdoorCapacity'
                                                        min={0}
                                                        disabled={this.state.noOutdoorSeating}
                                                        onKeyDown={this.preventNonNums}
                                                        style={errors.outdoorCapacity ?
                                                            (Object.assign({},
                                                                editLocationInputErrorStyle,
                                                                {
                                                                    borderWidth: '1px',
                                                                    borderRadius: '3px'
                                                                })) : null}
                                                    />
                                                    <div className={styles.formCapacityLabel}
                                                         style={errors.outdoorCapacity ?
                                                             ({color: 'red'}) : null}>Outdoor
                                                    </div>
                                                </div>
                                                <Field
                                                    className={styles.formNum}
                                                    type='number'
                                                    name='indoorCapacity'
                                                    min={0}
                                                    onKeyDown={this.preventNonNums}
                                                    style={errors.indoorCapacity ?
                                                        (Object.assign({},
                                                            editLocationInputErrorStyle,
                                                            {
                                                                borderWidth: '1px',
                                                                borderRadius: '3px'
                                                            })) : null}
                                                />
                                                <div className={styles.formCapacityLabel}
                                                     style={errors.indoorCapacity ?
                                                         ({color: 'red'}) : null}>Indoor
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    className={styles.addButton}
                                    disabled={this.state.imageLoading}
                                    type='submit'>
                                    Save
                                </Button>
                                <Button className={styles.deleteButton} variant='danger'
                                        onClick={this.deleteFunc}>Delete</Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }

    uploadFile = async (e) => {
        this.setState({imageLoading: true});
        const file = e.target.files[0];
        if (!file) {
            return
        }

        const loadingUrl = require('../../images/dashboardLoader.svg');
        this.setState({imageUrl: loadingUrl});

        const name = e.target.files[0].name ?? 'no_name';
        const lastDot = name.lastIndexOf('.');
        const dotExt = name.substring(lastDot);
        const filename = 'profile_picture_' + this.state.id + '_' + Math.floor(100000 + Math.random() * 900000) + dotExt;


        await Storage.put(filename, file, {
            level: 'public',
            contentDisposition: 'inline; filename="' + filename + '"',
            contentType: 'image/' + dotExt.substring(1),
        })
            .then((result) => {

            })
            .catch((err) => console.log('Upload error: ' + err));

        await Storage.get(filename).then((resultURL) => {
            const idx = resultURL.indexOf(filename);
            const url = resultURL.substring(0, idx) + '' + filename;
            this.setState({imageUrl: url});
        });

        this.setState({imageLoading: false});
    };

    deleteFunc = () => {
        const theyAreSure = window.confirm('Are you sure you want to delete this?')
        if (!theyAreSure)
            return
        const theyAreReallySure = window.confirm('This cannot be undone. Are you 100% sure?')
        if (!theyAreReallySure)
            return

        const apiName = 'ManageLocationApi';
        const path = '/location/active';
        const requestData = {
            headers: {},
            response: true,
            body: {
                id: this.props.data.id
            },
        }

        API.patch(apiName, path, requestData)
            .then(response => {
                window.alert('Delete successful.');
                this.props.handleDelete();
            })
            .catch(error => {
                console.log('Error: ', error);
                window.alert('Delete unsuccessful.');
            })

    }

    editLocation = async (values) => {
        const phoneRegEx = /\d+/g;
        if (values.businessPhoneNum?.length > 10)
            values.businessPhoneNum = values.businessPhoneNum.substr(3)
        values.businessPhoneNum = values.businessPhoneNum.match(phoneRegEx)?.join('');

        if (this.state.noOutdoorSeating)
            values.outdoorCapacity = '';

        const apiName = 'ManageLocationApi'
        const path = '/location/info'
        const requestData = {
            headers: {},
            body: {
                id: this.state.data.id,
                imageUrl: this.state.imageUrl,
                loc_name: values.businessName,
                email: values.businessEmail,
                phone: values.businessPhoneNum,
                loc_type: values.businessType,
                addrLine1: values.addr.line1,
                addrLine2: values.addr.line2,
                addrCity: values.addr.city,
                addrState: values.addr.state,
                addrZip: values.addr.zip,
                covidResponseSurvey: {
                    employeeMasks: values.employeeMasks,
                    socialDistancing: values.socialDistance,
                    outsideSeating: values.outsideSeating,
                    employeeTemp: values.employeeTemp,
                    sanitizeTables: values.sanitizeTables,
                    indoorCapacity: values.indoorCapacity,
                    outdoorCapacity: values.outdoorCapacity,
                }
            }
        }

        API.patch(apiName, path, requestData)
            .then(response => {
                this.props.handleUpdate()
            })
            .catch((error) => {
                console.log('Error: ' + error)
            })
    };

    preventNonNums = (e) => {
        const code = e.keyCode;
        if (code === 69 || code === 187 || code === 189 || code === 190)
            e.preventDefault();
    };

    unformatPhoneNum = (phoneNum) => {
        // not pretty but easiest way to handle this
        return '+1 (' + phoneNum.substr(0, 3)
            + ') ' + phoneNum.substr(3, 3) + '-'
            + phoneNum.substr(6)
    }

    renderStateDropdown = (errors) => {
        const mainStyle = {width: '100%', height: '25px'};
        return (
            <Field
                as='select'
                className={styles.formInput}
                name='addr.state'
                style={errors ? (Object.assign({},
                    editLocationInputErrorStyle, mainStyle)) : mainStyle}
            >
                <option value=''/>
                <option value='AK'>AK</option>
                <option value='AL'>AL</option>
                <option value='AR'>AR</option>
                <option value='AZ'>AZ</option>
                <option value='CA'>CA</option>
                <option value='CO'>CO</option>
                <option value='CT'>CT</option>
                <option value='DC'>District of Columbia</option>
                <option value='DE'>DE</option>
                <option value='FL'>FL</option>
                <option value='GA'>GA</option>
                <option value='HI'>HI</option>
                <option value='IA'>IA</option>
                <option value='ID'>ID</option>
                <option value='IL'>IL</option>
                <option value='IN'>IN</option>
                <option value='KS'>KS</option>
                <option value='KY'>KY</option>
                <option value='LA'>LA</option>
                <option value='MA'>MA</option>
                <option value='MD'>MD</option>
                <option value='ME'>ME</option>
                <option value='MI'>MI</option>
                <option value='MN'>MN</option>
                <option value='MO'>MO</option>
                <option value='MS'>MS</option>
                <option value='MT'>MT</option>
                <option value='NC'>NC</option>
                <option value='ND'>ND</option>
                <option value='NE'>NE</option>
                <option value='NH'>NH</option>
                <option value='NJ'>NJ</option>
                <option value='NM'>NM</option>
                <option value='NV'>NV</option>
                <option value='NY'>NY</option>
                <option value='OH'>OH</option>
                <option value='OK'>OK</option>
                <option value='OR'>OR</option>
                <option value='PA'>PA</option>
                <option value='PR'>PR</option>
                <option value='RI'>RI</option>
                <option value='SC'>SC</option>
                <option value='SD'>SD</option>
                <option value='TN'>TN</option>
                <option value='TX'>TX</option>
                <option value='UT'>UT</option>
                <option value='VA'>VA</option>
                <option value='VT'>VT</option>
                <option value='WA'>WA</option>
                <option value='WI'>WI</option>
                <option value='WV'>WV</option>
                <option value='WY'>WY</option>
            </Field>
        );
    };

}

const editLocationInputErrorStyle = {
    borderColor: 'red',
    boxShadow: '0 0 0 0.16rem rgba(255,0,0,.25)'
}

export default EditLocationInfo;
