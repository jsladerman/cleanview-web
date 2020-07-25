import React, {Component } from 'react';
import './css/QRCodeGenerator.css'
import uuid from 'react-uuid';
import {API} from 'aws-amplify';
import {Formik, Form, Field} from 'formik';
class QRCodeGenerator extends Component {
  // TODO: GET URL FROM DB, NOT PASSED IN AS PROP
  constructor(props) {
    super(props);
    this.state = {
      sublocations: ''
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
        this.setState(currState)
      })
      .catch(error => {
        console.log("Error: " + error)
      })
  }

  render() {
    if(!this.state.sublocations) {
      return(<p>Looking for sublocations...</p>)
    }
    
    const subLocationList = this.state.sublocations.map((sublocation) => {
      const total_id = this.props.id + '99strl99strl' + sublocation.id
      return(
        <SublocationQRCode id={total_id} name={sublocation.name} color={sublocation.color} key={sublocation.id}/>
      )
    })
    return (
      <div id="qr-code-block">
          <h3>QR Code Management</h3>
          <p>Explanation: You can use this one QR code for the whole restaurant or create as many QR codes as you want.</p>
          <p>If you want to know how people feel inside vs outside, make a QR code for that!</p>
          <p>If you want to know how people feel at each individual table, make a QR code for each one!</p>
          <AddNewSublocation handleSubmit={this.addSublocation}/>
          <br />
          {subLocationList}
      </div>
    );
  }
}

class AddNewSublocation extends Component {
  render() {
    return(
      <div>
        <h4>Add new sublocation</h4>
        <Formik
          onSubmit={(values) => this.props.handleSubmit(values)}
          initialValues={{
            name: '',
            color: '000000',
          }}
        >
          <Form>
            <label>Name: <Field type="input" name="name" /> </label> <br />
            <label>Color: <Field as="select" name="color">
                <option value="000000">Black</option>
                <option value="900C3F">Red</option>
                <option value="1189D7">Blue</option>
                <option value="12A501">Green</option>
                </Field> 
            </label>
            <br />
            <button type="submit">Generate sublocation.</button>
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
    const apiEndpoint = "https://api.qrserver.com/v1/create-qr-code/?data=https://b4fxzcx3f0.execute-api.us-east-1.amazonaws.com/dev/survey/"
    const sublocationId = this.props.id
    const colorParam = "&color=" + this.props.color
    const browserSizeParam = "&size=100x100"
    const inBrowserURL = apiEndpoint + sublocationId + colorParam + browserSizeParam

    const downloadSizeParam = "&size=500x500"
    const downloadURL = apiEndpoint + sublocationId + colorParam + downloadSizeParam

    return(
      <div>
        <h4>Here is the {this.props.name} QR code. It links to the survey and then the menu (see menu manager tab).</h4>
        <a href="#">
            <img src={inBrowserURL} alt="" title="" onClick={() => this.downloadQRCode(this.props.name, downloadURL)}/>
          </a>
      </div>
    );
  }
}

export default QRCodeGenerator;
