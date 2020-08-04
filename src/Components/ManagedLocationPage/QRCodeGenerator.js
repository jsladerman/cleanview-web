import React, { Component } from 'react';
import styles from './css/QRCodeGenerator.module.css'
import uuid from 'react-uuid';
import { API } from 'aws-amplify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Button from "react-bootstrap/Button";
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class QRCodeGenerator extends Component {
  // TODO: GET URL FROM DB, NOT PASSED IN AS PROP
  constructor(props) {
    super(props);
    this.state = {
      sublocations: '',
      environmentURL: '',
      menuLink: '',
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
      active: 1,
      menuLink: this.state.menuLink
    })

    this.updateSublocations(currentSublocations)
  }

  updateSublocations = (sublocations) => {
    const apiName = 'ManageLocationApi';
    const path = '/location/sublocations';
    const requestData = {
      headers: {},
      response: true,
      body: {
        sublocations: sublocations,
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
    const apiName = 'ManageLocationApi';
    const path = '/location/object';
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
        currState.menuLink = response.data.body.menu_link
        this.setState(currState)
      })
      .catch(error => {
        console.log("Error: " + error)
      })
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

  deleteSublocation = (name) => {
    let currentSublocations = this.state.sublocations
    for(let i=0; i<currentSublocations.length; ++i) {
      if(currentSublocations[i].name === name) {
        currentSublocations[i].active = 0
      }
    }
    this.updateSublocations(currentSublocations)
  }

  recoverSublocation = (name) => {
    let currentSublocations = this.state.sublocations
    for(let i=0; i<currentSublocations.length; ++i) {
      if(currentSublocations[i].name === name) {
        currentSublocations[i].active = 1
      }
    }
    this.updateSublocations(currentSublocations)
  }

  render() {
    if (!this.state.sublocations) {
      return (<p>Looking for QR codes...</p>)
    }

    const sublocationRow = (name, color, sublocId, menuLink) => {
      const totalId = this.props.id + '99strl99strl' + sublocId
      const apiEndpoint = "https://api.qrserver.com/v1/create-qr-code/?data=" + this.state.environmentURL + "/survey/"
      const colorParam = "&color=" + color


      const browserSizeParam = "&size=100x100"
      const inBrowserURL = apiEndpoint + totalId + colorParam + browserSizeParam

      const downloadSizeParam = "&size=500x500"
      const downloadURL = apiEndpoint + totalId + colorParam + downloadSizeParam
      return(
        <tr className={styles.qrRow}>
          <td className={styles.qrNameCol}>
            {name}
          </td>
          <td className={styles.qrCodeCol}>
            <a href="#">
              <img src={inBrowserURL} alt="" title="" onClick={() => this.downloadQRCode(name, downloadURL)} />
             </a>
          </td>
          <td>
            <a href={menuLink ?? this.state.menuLink} target="_blank">See menu</a>
          </td>
        </tr>
      );
    }

    const sublocationtable = () => {
      return(
        <div>
          <h4 className={styles.qrCodeSubheader}>Your QR Codes</h4>
          <Table striped bordered hover className={styles.qrTable}>
          <thead className={styles.qrTableHeaderRow}>
            <tr>
              <th>
              Name
              </th>
              <th>
              QR Code Image (click to download)
              </th>
              <th>
                Menu Link
              </th>
            </tr>
          </thead>
          <tbody>
          {this.state.sublocations.map((sublocation) => {
            if(sublocation.active)
              return sublocationRow(sublocation.name, sublocation.color, sublocation.id, sublocation.menuLink)
          })}
          </tbody>
        </Table>
        </div>
        

      )
    }

    

    return (
        <div className={styles.qrManagementBlock}>
          <div className="container-fluid text-wrap">
            <h2 id={styles.qrHeader}>QR Code Management</h2>
            <p>You can use a single QR code for the whole restaurant, or you can create multiple QR codes to gain more
              targeted insight.</p>
            <lh id={styles.listHeader}>Examples</lh>
            <ul>
              <li>Use distinct QR codes for indoor and outdoor tables</li>
              <li>Use distinct QR codes for each individual table</li>
            </ul>
            <Row>
              <Col>
                <AddNewSublocation sublocations={this.state.sublocations}handleSubmit={this.addSublocation} />
              </Col>
              <Col>
                <DeleteSublocation sublocations={this.state.sublocations} handleSubmit={this.deleteSublocation}/>
              </Col>
              <Col>
                <RecoverSublocation sublocations={this.state.sublocations} handleSubmit={this.recoverSublocation} />
              </Col>
            </Row>
            {sublocationtable()}
            
          </div>
        </div>
    );
  }
}

class AddNewSublocation extends Component {
  render() {
    return (
      <div>
        <h4 className={styles.qrCodeSubheader}>Create New QR Code</h4>
        <Formik
          onSubmit={(values) => this.props.handleSubmit(values)}
          initialValues={{
            name: '',
            color: '000000',
          }}
          validate={(values) => {
            let errors = {}
            if(!values.name)
              errors.name = "You must name your QR code."
            else
              for(let i=0; i<this.props.sublocations.length; ++i) 
                  if(values.name.toLowerCase() === this.props.sublocations[i].name.toLowerCase())
                    if(this.props.sublocations[i].active)
                      errors.name = "This QR code name exists already"
                    else
                      errors.name = 'You can recover this QR code in the Recover section.'
            
            return errors;
          }}
        >
          <Form className={styles.qrCodeGeneratorWrapper}>
            <Row>
              <Col className={styles.qrCodeFormColumn}>
                <div className="form-group" class="column-contents">
                  <label className={styles.qrField}>Name </label>
                  <Field type="input" name="name" class="form-control" />
                </div>
              </Col>
              <Col className={styles.qrCodeFormColumn}>
                <div className="form-group" class="column-contents">
                  <label className={styles.qrField}>Color </label>
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
            <Row>
              <Col className={styles.qrCodeFormColumn}>
                <ErrorMessage type="div" name="name" style={{'color': 'red'}}/>
              </Col>
            </Row>
          </Form>
        </Formik>
      </div>
    );
  }
}

class DeleteSublocation extends Component {
  render() {
    return(
      <div>
        <h4 className={styles.qrCodeSubheader}>Delete QR Code</h4>
        <Formik
        initialValues={{
          code: 'none'
        }}
        onSubmit={(values) => this.props.handleSubmit(values.code)}
        validate={(values) => {
          let errors = {}
          if(values.code === 'none')
            errors.code = 'Please select a valid QR code.'

          return errors
        }}
        >
          <Form className={styles.qrCodeDeleteWrapper}>
            <Row>
              <Col className={styles.qrCodeFormColumn}>
                  <div className='form-group' class="column-contents">
                    <label className={styles.qrField}>Name</label>
                    <Field as="select" name="code" class="form-control">
                      <option value={'none'}>Select a QR code</option>
                      {this.props.sublocations.map((sublocation) => {
                        if(sublocation.active) {
                          return(
                            <option value={sublocation.name}>{sublocation.name}</option>
                          );
                        }
                        return(<div></div>);
                      })}
                    </Field>
                  </div>
              </Col>
              <Col className={styles.qrCodeFormColumn}>
                  <Button variant="danger" className={styles.deleteQrCodeSubmit} type="submit">Delete</Button>
              </Col>
            </Row>
            <Row>
              <Col className={styles.qrCodeFormColumn}>
                <ErrorMessage type="div" name="code" style={{'color': 'red'}}/>
              </Col>
            </Row>
          </Form>
        </Formik>
      </div>
    );
  }
}

class RecoverSublocation extends Component {
  render() {
    return(
      <div>
        <h4 className={styles.qrCodeSubheader}>Recover QR Code</h4>
        <Formik
        initialValues={{
          code: 'none'
        }}
        onSubmit={(values) => this.props.handleSubmit(values.code)}
        validate={(values) => {
          let errors = {}
          if(values.code === 'none')
            errors.code = 'Please select a valid QR code.'

          return errors
        }}
        >
          <Form className={styles.qrCodeRecoverWrapper}>
            <Row>
              <Col className={styles.qrCodeFormColumn}>
                  <div className='form-group' class="column-contents">
                    <label className={styles.qrField}>Name</label>
                    <Field as="select" name="code" class="form-control">
                      <option value={'none'}>Select a QR code</option>
                      {this.props.sublocations.map((sublocation) => {
                        if(!sublocation.active) {
                          return(
                            <option value={sublocation.name}>{sublocation.name}</option>
                          );
                        }
                        return(<div></div>);
                      })}
                    </Field>
                  </div>
              </Col>
              <Col className={styles.qrCodeFormColumn}>
                  <Button className={styles.generateQrCodeSubmit} type="submit">Recover</Button>
              </Col>
            </Row>
            <Row>
              <Col className={styles.qrCodeFormColumn}>
                <ErrorMessage type="div" name="code" style={{'color': 'red'}}/>
              </Col>
            </Row>
          </Form>
        </Formik>
      </div>
    );
  }
}



export default QRCodeGenerator;
