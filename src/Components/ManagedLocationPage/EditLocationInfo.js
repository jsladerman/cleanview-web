import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { Field, Form, Formik, ErrorMessage } from "formik";
import styles from "./css/EditLocationInfo.module.css";
import Button from "react-bootstrap/Button";

class EditLocationInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      imageUrl: this.props.data.imageUrl,
      id: this.props.data.id,
      imageLoading: false,
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

  editLocation = (values) => {
      
  };

  render() {
    return (
      <div className={styles.editLocation}>
        <div className={styles.editLocationHeader}>Edit Location</div>
        <Formik
          initialValues={{
            businessName: this.state.data.loc_name,
            businessType: this.state.data.loc_type,
            businessEmail: this.state.data.businessEmail,
            businessPhoneNum: this.state.data.businessPhoneNum,
            addr: {
              line1: this.state.data.addrLine1,
              line2: this.state.data.addrLine2,
              city: this.state.data.addrCity,
              state: this.state.data.addrState,
              zip: this.state.data.addrZip,
            },
            employeeMasks: this.state.data.covidResponseSurvey.employeeMasks,
            employeeTemp: this.state.data.covidResponseSurvey.employeeTemp,
            socialDistance: this.state.data.covidResponseSurvey.socialDistance,
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
                        <Field type="radio" name="sanitize" value="y" />
                        <div className={styles.formRadioBtn} />
                      </label>
                      <label className={styles.formRadioLabel}>Yes</label>
                      <label className={styles.customRadioBtnContainer}>
                        <Field type="radio" name="sanitize" value="n" />
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
                type="submit"
              >
                Add
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    );
  }
}

export default EditLocationInfo;
