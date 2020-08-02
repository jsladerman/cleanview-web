import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { Field, Form, Formik, ErrorMessage } from "formik";
import styles from "./css/EditLocationInfo.module.css";
import Button from "react-bootstrap/Button";
import Alert from 'react-bootstrap/Alert';


class EditLocationInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      imageUrl: this.props.data.imageUrl,
      imageLoading: false,
      noOutdoorSeating: this.props.data.covidResponseSurvey.outsideSeating === 'n' ? true : false,
      phoneNumError: false,
    };
    this.editLocation = this.editLocation.bind(this);
  }

  renderStateDropdown = () => {
    return (
      <Field
        as="select"
        style={{ width: "100%", height: "26px" }}
        name="addr.state"
      >
        <option value="" />
        <option value="AK">AK</option>
        <option value="AL">AL</option>
        <option value="AR">AR</option>
        <option value="AZ">AZ</option>
        <option value="CA">CA</option>
        <option value="CO">CO</option>
        <option value="CT">CT</option>
        <option value="DC">District of Columbia</option>
        <option value="DE">DE</option>
        <option value="FL">FL</option>
        <option value="GA">GA</option>
        <option value="HI">HI</option>
        <option value="IA">IA</option>
        <option value="ID">ID</option>
        <option value="IL">IL</option>
        <option value="IN">IN</option>
        <option value="KS">KS</option>
        <option value="KY">KY</option>
        <option value="LA">LA</option>
        <option value="MA">MA</option>
        <option value="MD">MD</option>
        <option value="ME">ME</option>
        <option value="MI">MI</option>
        <option value="MN">MN</option>
        <option value="MO">MO</option>
        <option value="MS">MS</option>
        <option value="MT">MT</option>
        <option value="NC">NC</option>
        <option value="ND">ND</option>
        <option value="NE">NE</option>
        <option value="NH">NH</option>
        <option value="NJ">NJ</option>
        <option value="NM">NM</option>
        <option value="NV">NV</option>
        <option value="NY">NY</option>
        <option value="OH">OH</option>
        <option value="OK">OK</option>
        <option value="OR">OR</option>
        <option value="PA">PA</option>
        <option value="PR">PR</option>
        <option value="RI">RI</option>
        <option value="SC">SC</option>
        <option value="SD">SD</option>
        <option value="TN">TN</option>
        <option value="TX">TX</option>
        <option value="UT">UT</option>
        <option value="VA">VA</option>
        <option value="VT">VT</option>
        <option value="WA">WA</option>
        <option value="WI">WI</option>
        <option value="WV">WV</option>
        <option value="WY">WY</option>
      </Field>
    );
  };

  uploadFile = async (e) => {
    const file = e.target.files[0];
    if(!file) { return }

    const loadingUrl = require("../../images/dashboardLoader.svg");
    this.setState({ imageUrl: loadingUrl });

    const name = e.target.files[0].name ?? "no_name";
    const lastDot = name.lastIndexOf(".");
    const dotExt = name.substring(lastDot);
    const filename = "profile_picture_" + this.state.id + "_" + Math.floor(100000 + Math.random() * 900000) + dotExt;


    await Storage.put(filename, file, {
      level: "public",
      contentDisposition: 'inline; filename="' + filename + '"',
      contentType: "image/" + dotExt.substring(1),
    })
      .then((result) => {
        
      })
      .catch((err) => console.log("Upload error: " + err));

    await Storage.get(filename).then((resultURL) => {
      const idx = resultURL.indexOf(filename);
      const url = resultURL.substring(0, idx) + "" + filename;
      this.setState({ imageUrl: url });
    });

    this.setState({ imageLoading: false });
  };

  validateFieldsFilled = (values) => {
    if(!values) {
      return false
    }
    if(!values.businessName) {
      return false
    }
    if(!values.businessType) {
      return false
    }
    if(!values.businessEmail) {
      return false
    }
    if(!values.businessPhoneNum) {
      return false
    }
    if(!values.addr) {
      return false
    }
    if(!values.addr.line1) {
      return false
    }
    if(!values.addr.city) {
      return false
    }
    if(!values.addr.state) {
      return false
    }
    if(!values.addr.zip) {
      return false
    }
    if(!values.employeeMasks) {
      return false
    }
    if(!values.employeeTemp) {
      return false
    }
    if(!values.socialDistance) {
      return false
    }
    if(!values.sanitizeTables) {
      return false
    }
    if(!values.outsideSeating) {
      return false
    }
    if(!values.indoorCapacity) {
      return false
    }
    return true
}

  editLocation = async (values) => {
    const allValuesFilled = this.validateFieldsFilled(values)
    if (!allValuesFilled) {
      this.setState({valueEmptyError: true})
      return
    }

    const phoneRegEx = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneRegEx.test(values.businessPhoneNum)) {
      this.setState({phoneNumError: true})
      return
    }

    this.setState({valueEmptyError: false})
    this.setState({phoneNumError: false})

    const apiName = "ManageLocationApi"
    const path = "/location/info"
    const requestData = {
        headers: {},
        body: {
            id: this.state.data.id,
            imageUrl: this.state.imageUrl,
            loc_name: values.businessName,
            email: values.businessEmail,
            phone: this.parsePhoneNumber(values.businessPhoneNum),
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
                sanitizeTables: values.sanitize,
                indoorCapacity: values.indoorCapacity,
                outdoorCapacity: this.state.noOutdoorSeating
                  ? ""
                  : values.outdoorCapacity,
              }
        }
    }

    API.patch(apiName, path, requestData)
    .then(response => {
        this.props.handleUpdate()
    })
    .catch((error) => {
        console.log("Error: " + error)
    })
  };

  renderAlert = () => {
    if(this.state.valueEmptyError) {
      return(
        <Alert variant="danger" dismissible
                onClose={() => this.setState({valueEmptyError: false})}
                style={{whiteSpace: 'normal'}}>
            <Alert.Heading>Error</Alert.Heading>
            <div>
                All values must be filled in.
            </div>
          </Alert>
      )
    }
    if (this.state.phoneNumError)
        return (
            <Alert variant="danger" dismissible
                   onClose={() => this.setState({phoneNumError: false})}
                   style={{whiteSpace: 'normal'}}>
                <Alert.Heading>Error</Alert.Heading>
                <div>
                    Phone number must be in this format: 800-555-1234
                </div>
            </Alert>
        )
  }

  parsePhoneNumber = (phoneNumber) => {
    return phoneNumber.split('-').join('');
  }

  formatPhoneNumber = (phoneNumber) => {
    return phoneNumber.substr(0, 3) + '-' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6, 4);
  }



  render() {
    return (
      <div className={styles.editLocation}>
        {this.renderAlert()}
        <div className={styles.editLocationHeader}>Edit Location</div>
        <Formik
          initialValues={{
            businessName: this.state.data.loc_name,
            businessType: this.state.data.loc_type,
            businessEmail: this.state.data.email,
            businessPhoneNum: this.formatPhoneNumber(this.state.data.phone),
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
            outdoorCapacity: this.state.data.covidResponseSurvey
              .outdoorCapacity,
          }}
          onSubmit={this.editLocation}
        >
          <Form className={styles.form}>
            <div className={styles.formCols}>
              <div className={styles.formCol}>
                <div className={styles.formColHeader}>General Information</div>
                <div className={styles.formLabel}>Business Name</div>
                <Field
                  className={styles.formInput}
                  type="input"
                  name="businessName"
                />
                <div className={styles.formLabel}>Business Type</div>
                <Field
                  as="select"
                  style={{ width: "165px", height: "26px" }}
                  className={styles.formInput}
                  name="businessType"
                >
                  <option value="" />
                  <option value="restaurant">Restaurant</option>
                  <option value="other">Other</option>
                </Field>
                <div className={styles.formLabel}>Business Email</div>
                <Field
                  className={styles.formInput}
                  type="input"
                  name="businessEmail"
                />
                <div className={styles.formLabel}>Business Phone #</div>
                <Field
                  className={styles.formInput}
                  type="input"
                  name="businessPhoneNum"
                />
              </div>
              <div className={styles.formCol}>
                <div className={styles.formColHeader}>Business Address</div>
                <div className={styles.formLabel}>Street</div>
                <Field
                  className={styles.formInput}
                  type="input"
                  name="addr.line1"
                />
                <div className={styles.formLabel}>Apt, Suite, etc.</div>
                <Field
                  className={styles.formInput}
                  type="input"
                  name="addr.line2"
                />
                <div className={styles.formLabel}>City</div>
                <Field
                  className={styles.formInput}
                  type="input"
                  name="addr.city"
                />
                <div
                  style={{ width: "40%", float: "left", marginRight: "12px" }}
                >
                  <div className={styles.formLabel}>State</div>
                  {this.renderStateDropdown()}
                </div>
                <div style={{ width: "50%", float: "left" }}>
                  <div className={styles.formLabel}>Zip Code</div>
                  <Field
                    style={{ width: "100%" }}
                    type="input"
                    name="addr.zip"
                  />
                </div>
              </div>
              <div className={styles.formCol}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={(ref) => (this.upload = ref)}
                  onChange={(evt) => this.uploadFile(evt)}
                />
                <img
                  src={require("../../images/addLocationCamera.svg")}
                  alt=""
                  height="50px"
                  style={{
                    cursor: "pointer",
                    float: "right",
                    marginTop: "-16px",
                  }}
                  onClick={() => {
                    this.upload.click();
                  }}
                />
                <div className={styles.formColHeader}>Upload Image:</div>
                <div className={styles.imageLabel}>Example scaled image:</div>
                <img
                  src={this.state.imageUrl}
                  alt=""
                  style={{
                    borderRadius: "8px",
                    width: "250px",
                    height: "160px",
                  }}
                />
              </div>
            </div>
            <div className={styles.surveyBox}>
              <br />
              <div className={styles.formColHeader}>COVID Response Survey</div>
              <div className={styles.formQuestions}>
                <div className={styles.formQuestionsCols}>
                  <div className={styles.formQuestionsCol}>
                    <div>
                      <div className={styles.formRadioQuestion}>
                        Are your employees required to wear masks?
                      </div>
                      <label className={styles.customRadioBtnContainer}>
                        <Field type="radio" name="employeeMasks" value="y" />
                        <div className={styles.formRadioBtn} />
                      </label>
                      <label className={styles.formRadioLabel}>Yes</label>
                      <label className={styles.customRadioBtnContainer}>
                        <Field type="radio" name="employeeMasks" value="n" />
                        <div className={styles.formRadioBtn} />
                      </label>
                      <label className={styles.formRadioLabel}>No</label> <br />
                      <br />
                    </div>
                    <div>
                      <div className={styles.formRadioQuestion}>
                        Do you take the temperature of your employees every day?
                      </div>
                      <label className={styles.customRadioBtnContainer}>
                        <Field type="radio" name="employeeTemp" value="y" />
                        <div className={styles.formRadioBtn} />
                      </label>
                      <label className={styles.formRadioLabel}>Yes</label>
                      <label className={styles.customRadioBtnContainer}>
                        <Field type="radio" name="employeeTemp" value="n" />
                        <div className={styles.formRadioBtn} />
                      </label>
                      <label className={styles.formRadioLabel}>No</label> <br />
                      <br />
                    </div>
                  </div>
                  <div className={styles.formQuestionsCol}>
                    <div>
                      <div className={styles.formRadioQuestion}>
                        Do you enforce social distancing guidelines?
                      </div>
                      <label className={styles.customRadioBtnContainer}>
                        <Field type="radio" name="socialDistance" value="y" />
                        <div className={styles.formRadioBtn} />
                      </label>
                      <label className={styles.formRadioLabel}>Yes</label>
                      <label className={styles.customRadioBtnContainer}>
                        <Field type="radio" name="socialDistance" value="n" />
                        <div className={styles.formRadioBtn} />
                      </label>
                      <label className={styles.formRadioLabel}>No</label> <br />
                      <br />
                      <div className={styles.formRadioQuestion}>
                        Do you have outside seating?
                      </div>
                      <label className={styles.customRadioBtnContainer}>
                      <Field
                          type="radio"
                          name="outsideSeating"
                          value="y"
                          onClick={() =>
                            this.setState({ noOutdoorSeating: false })
                          }
                        />
                        <div className={styles.formRadioBtn} />
                      </label>
                      <label className={styles.formRadioLabel}>Yes</label>
                      <label className={styles.customRadioBtnContainer}>
                        <Field
                          type="radio"
                          name="outsideSeating"
                          value="n"
                          onClick={() =>
                            this.setState({ noOutdoorSeating: true })
                          }
                        />
                        <div className={styles.formRadioBtn} />
                      </label>
                      <label className={styles.formRadioLabel}>No</label> <br />
                      <br />
                    </div>
                  </div>
                  <div className={styles.formQuestionsCol}>
                    <div>
                      <div className={styles.formRadioQuestion}>
                        Do you sanitize tables after every meal?
                      </div>
                      <label className={styles.customRadioBtnContainer}>
                        <Field type="radio" name="sanitizeTables" value="y" />
                        <div className={styles.formRadioBtn} />
                      </label>
                      <label className={styles.formRadioLabel}>Yes</label>
                      <label className={styles.customRadioBtnContainer}>
                        <Field type="radio" name="sanitizeTables" value="n" />
                        <div className={styles.formRadioBtn} />
                      </label>
                      <label className={styles.formRadioLabel}>No</label> <br />
                      <br />
                      <div className={styles.formRadioQuestion}>Capacity:</div>
                      <br />
                      <div
                        style={{
                          float: "left",
                          marginLeft: "8px",
                          marginRight: "16px",
                        }}
                      >
                        <Field
                          className={styles.formNum}
                          type="number"
                          name="outdoorCapacity"
                          min={0}
                          disabled={this.state.noOutdoorSeating}
                          onKeyDown={this.preventNonNums}
                        />
                        <div className={styles.formCapacityLabel}>Outdoor</div>
                      </div>
                      <Field
                        className={styles.formNum}
                        type="number"
                        name="indoorCapacity"
                        min={0}
                        onKeyDown={this.preventNonNums}
                      />
                      <div className={styles.formCapacityLabel}>Indoor</div>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                className={styles.addButton}
                disabled={this.state.imageLoading}
                type="submit" >
                Save
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    );
  }
}



export default EditLocationInfo;
