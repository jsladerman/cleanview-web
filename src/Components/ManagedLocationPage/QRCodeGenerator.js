import React, { Component } from 'react';
import styles from './css/QRCodeGenerator.module.css'
import uuid from 'react-uuid';
import { API } from 'aws-amplify';
import { Formik, Form, Field } from 'formik';
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class QRCodeGenerator extends Component {
  // TODO: GET URL FROM DB, NOT PASSED IN AS PROP
  constructor(props) {
    super(props);
    this.state = {
      sublocations: '',
      environmentURL: ''
    };

    this.addSublocation = this.addSublocation.bind(this)
    this.updateDataFromDB = this.updateDataFromDB.bind(this)

  }
  componentDidMount() {
    this.updateDataFromDB()
  }

  addSublocation = (values) => {
    console.log('Adding sublocation...')
    let currentSublocations = this.state.sublocations
    currentSublocations.push({
      name: values.name,
      id: uuid(),
      color: values.color,
    })

    const apiName = 'manageLocationApi';
    const path = '/manageLocation/sublocations';
    const requestData = {
      headers: {},
      response: true,
      body: {
        sublocations: currentSublocations,
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

  updateDataFromDB = async () => {
    const apiName = 'manageLocationApi';
    const path = '/manageLocation/object';
    const requestData = {
      headers: {},
      response: true,
      queryStringParameters: {
        id: this.props.id
      }
    }

    API.get(apiName, path, requestData)
      .then(response => {
        let currState = this.state
        currState.sublocations = response.data.body.sublocations
        currState.environmentURL = response.data.environmentURL
        this.setState(currState)
      })
      .catch(error => {
        console.log("Error: " + error)
      })
  }

  render() {
    if (!this.state.sublocations) {
      return (<p>Looking for sublocations...</p>)
    }

    const subLocationList = this.state.sublocations.map((sublocation) => {
      const total_id = this.props.id + '99strl99strl' + sublocation.id
      return(
        <SublocationQRCode id={total_id} name={sublocation.name} color={sublocation.color} key={sublocation.id} environmentURL={this.state.environmentURL}/>
      )
    })
    return (
        <div className={styles.qrCodeBlock}>
          <div className="container-fluid text-wrap">
            <h2>QR Code Management</h2>
            <p>You can use a single QR code for the whole restaurant, or you can create multiple QR codes to gain more
              targeted insight.</p>
            <p>Examples:</p>
            <ul>
              <li>Use distinct QR codes for indoor and outdoor tables</li>
              <li>Use distinct QR codes for each individual table</li>
            </ul>
            <AddNewSublocation handleSubmit={this.addSublocation}/>
            <br/>

            <h4 className={styles.qrCodeSubheader}>Your QR Codes</h4>
            <p>Each QR code links to the survey and then to your menu. You can manage your menu on the Menu Manager
              tab.</p>
            {subLocationList}
          </div>
        </div>
    );
  }
}

class AddNewSublocation extends Component {
  render() {
    return (
      <div>
        <h4 className={styles.qrCodeSubheader}>Create new QR code</h4>
        <Formik
          onSubmit={(values) => this.props.handleSubmit(values)}
          initialValues={{
            name: '',
            color: '000000',
          }}
        >
          <Form className={styles.qrCodeGeneratorWrapper}>
            <Row>
              <Col className={styles.qrCodeFormColumn}>
                <div className="form-group" class="column-contents">
                  <label className={styles.label}>Name </label>
                  <Field type="input" name="name" class="form-control" />
                </div>
              </Col>
              <Col className={styles.qrCodeFormColumn}>
                <div class="form-group" class="column-contents">
                  <label className={styles.label}>Color </label>
                  <Field as="select" name="color" class="form-control">
                    <option value="000000">Black</option>
                    <option value="900C3F">Red</option>
                    <option value="1189D7">Blue</option>
                    <option value="12A501">Green</option>
                  </Field>
                </div>
              </Col>
              <Col className={styles.qrCodeFormColumn}>
                <Button className={styles.generateQrCodeSubmit} type="submit">Generate</Button>
              </Col>
            </Row>
          </Form>
        </Formik>
      </div>
    );
  }
}

class SublocationQRCode extends Component {
  constructor(props) {
    super(props)

    this.downloadQRCode = this.downloadQRCode.bind(this)
  }

  downloadQRCode = (name, link) => {
    fetch(link)
      .then((response) => {
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = "qr_code_" + name + ".jpg";
          a.click();
        });
      });
  };

  render() {
    const apiEndpoint = "https://api.qrserver.com/v1/create-qr-code/?data=" + this.props.environmentURL + "/survey/"
    const sublocationId = this.props.id
    const colorParam = "&color=" + this.props.color
    const browserSizeParam = "&size=100x100"
    const inBrowserURL = apiEndpoint + sublocationId + colorParam + browserSizeParam

    const downloadSizeParam = "&size=500x500"
    const downloadURL = apiEndpoint + sublocationId + colorParam + downloadSizeParam

    return (
      <div>
        <p className={styles.qrHeader}>{this.props.name} QR code:</p>
        <a href="#">
          <img src={inBrowserURL} alt="" title="" onClick={() => this.downloadQRCode(this.props.name, downloadURL)} />
        </a>
      </div>
    );
  }
}

export default QRCodeGenerator;
