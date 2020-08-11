import React, {Component} from 'react';
import styles from './css/QRCodeGenerator.module.css'
import uuid from 'react-uuid';
import {API} from 'aws-amplify';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Button from "react-bootstrap/Button";
import Table from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from "@trendmicro/react-modal";
import qrTemplates from './qrTemplates/dimensions.json';
import bold from './qrTemplates/Bold.png';
import crisp from './qrTemplates/Crisp.png';
import quadrant from './qrTemplates/Quadrant.png';
import simple from './qrTemplates/Simple.png';


class QRCodeGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sublocations: this.props.sublocations,
            environmentURL: '',
            menus: this.props.menus,
            showModal: false,
            loadingModal: {
                bold: false,
                crisp: false,
                simple: false,
                quadrant: false
            },
            selectedQRLink: '',
            selectedTemplate: '',
            selectedName: '',
            tempImg: null,
            qrImg: null,
            selectedDims: null,
            compositeUrl: ''
        };

        this.addSublocation = this.addSublocation.bind(this)
        this.updateDataFromDB = this.updateDataFromDB.bind(this)
    }

    componentDidMount() {
        this.updateDataFromDB()
    }

    addSublocation = (values) => {
        var alreadyExists = false
        let currentSublocations = this.state.sublocations

        for (let i = 0; i < currentSublocations.length; ++i)
            if (values.name.toLowerCase() === currentSublocations[i].name.toLowerCase() && !currentSublocations[i].active) {
                alreadyExists = true
                currentSublocations[i].active = true
                currentSublocations[i].color = values.color
                currentSublocations[i].menu = values.menu === 'none' ? 'none' : JSON.parse(values.menu)
            }

        if (!alreadyExists) {
            currentSublocations.push({
                name: values.name,
                id: uuid(),
                color: values.color,
                active: 1,
                menu: values.menu === 'none' ? 'none' : JSON.parse(values.menu),
            })
        }

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
                currState.menus = response.data.body.menus
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
                    // window.open(url, '_blank')
                    a.href = url;
                    a.target = '_blank';
                    a.download = "qr_code_" + name + ".jpg";
                    a.click();
                });
            });
    }

    displayQRTemplate = (template, link, name) => {
        let currState = this.state;
        currState.selectedName = name;
        currState.loadingModal[template] = true;
        this.setState(currState);
        const styleMap = {
            'bold': bold,
            'crisp': crisp,
            'quadrant': quadrant,
            'simple': simple
        }
        fetch(link)
            .then((response) => {
                response.blob().then((blob) => {
                    let qrUrl = window.URL.createObjectURL(blob);
                    currState.selectedTemplate = styleMap[template];
                    currState.selectedQRLink = qrUrl;
                    currState.selectedDims = qrTemplates[template];
                    currState.selectedTemplateName = template;
                    this.setState(currState);
                    this.buildQRTemplate(template);
                });
            })
            .catch(() => {
                currState.loadingModal[template] = false;
                this.setState(currState);
            });
    }

    buildQRTemplate = (template) => {
        let qrImg = new Image();
        qrImg.crossOrigin = "Anonymous";
        qrImg.src = this.state.selectedQRLink;
        let tempImg = new Image();
        tempImg.crossOrigin = "Anonymous";
        tempImg.src = this.state.selectedTemplate;
        let canvas = document.createElement('canvas')
        canvas.setAttribute('width', this.state.selectedDims.size.x);
        canvas.setAttribute('height', this.state.selectedDims.size.y);
        console.log(typeof (canvas));
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, this.state.selectedDims.size.x, this.state.selectedDims.size.y)

        let tempPromise = new Promise((resolve) => {
            tempImg.onload = () => {
                ctx.drawImage(
                    tempImg,
                    this.state.selectedDims.size.sx, this.state.selectedDims.size.sy,
                    this.state.selectedDims.size.x, this.state.selectedDims.size.y,
                    0, 0,
                    this.state.selectedDims.size.x, this.state.selectedDims.size.y
                );
                resolve('Template Drawn');
            }
        });

        let qrPromise = new Promise((resolve) => {
            qrImg.onload = () => {
                ctx.drawImage(qrImg,
                    this.state.selectedDims.loc.x,
                    this.state.selectedDims.loc.y,
                    this.state.selectedDims.qrSize,
                    this.state.selectedDims.qrSize
                );
                resolve('QR Drawn');
            }
        });

        tempPromise.then(() => {
            qrPromise.then(() => {
                let currState = this.state;
                currState.compositeUrl = canvas.toDataURL('image/jpeg');
                currState.showModal = !this.state.showModal;
                currState.loadingModal[template] = false;
                this.setState(currState);
            })
        })
    }

    downloadSelectedTemplate = () => {
        let a = document.createElement("a");
        a.href = this.state.compositeUrl;
        a.download = this.state.selectedName + '_' + this.state.selectedTemplateName + ".jpg";
        a.click();
    }

    deleteSublocation = (name) => {
        let currentSublocations = this.state.sublocations
        for (let i = 0; i < currentSublocations.length; ++i) {
            if (currentSublocations[i].name === name) {
                currentSublocations[i].active = 0
            }
        }
        this.updateSublocations(currentSublocations)
    }

    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    renderTemplateBtn = (tempType, downloadURL, rowName) => {
        if (this.state.loadingModal[tempType] && this.state.selectedName === rowName)
            return (
                <div className={styles.generateQrLoaderDiv}>
                    <img
                        src={require("../../images/loadingSpinner.svg")}
                        alt=''
                        height='35px'
                        style={{
                            margin: 'auto',
                            display: 'block'
                        }}
                    />
                </div>
            )
        else
            return <Button className={styles.generateQrTemplate}
                           onClick={() => this.displayQRTemplate(tempType, downloadURL, rowName)}>
                {tempType.charAt(0).toUpperCase() + tempType.slice(1)}
            </Button>
    }

    render() {
        if (!this.state.sublocations) {
            return (<p>Looking for QR codes...</p>)
        }

        const sublocationRow = (name, color, sublocId, menu) => {
            if (!menu)
                return

            const totalId = this.props.id + '99strl99strl' + sublocId + '99menu99' + menu.name
            const apiEndpoint = "https://api.qrserver.com/v1/create-qr-code/?data=" + this.state.environmentURL + "/survey/"
            const colorParam = "&color=" + color


            const browserSizeParam = "&size=100x100"
            const inBrowserURL = apiEndpoint + totalId + colorParam + browserSizeParam

            const downloadSizeParam = "&size=500x500"
            const downloadURL = apiEndpoint + totalId + colorParam + downloadSizeParam

            return (
                <tr className={styles.qrRow}>
                    <td className={styles.qrNameCol}>
                        {name}
                    </td>
                    <td className={styles.qrCodeCol}>
                        <a href="#">
                            <img src={inBrowserURL} alt="" title=""
                                 onClick={() => this.downloadQRCode(name, downloadURL)}/>
                        </a>
                    </td>
                    <td>
                        <div style={{marginLeft: '5px'}}>
                            <Row>
                                {this.renderTemplateBtn('bold', downloadURL, name)}
                                {this.renderTemplateBtn('crisp', downloadURL, name)}
                            </Row>
                            <Row>
                                {this.renderTemplateBtn('simple', downloadURL, name)}
                                {this.renderTemplateBtn('quadrant', downloadURL, name)}
                            </Row>
                        </div>
                    </td>
                    <td>
                        {menu.url ?
                            <a href={menu.url} target="_blank" rel="noopener noreferrer">{menu.name}</a> : "No menu"}
                    </td>
                </tr>
            );
        }

        const sublocationtable = () => {
            if (this.state.sublocations.length === 0)
                return (<div>You don't have any QR codes yet.</div>)

            return (
                <div>
                    <Modal
                        show={this.state.showModal}
                        onClose={this.toggleModal}
                        showCloseButton={true}
                        style={{
                            borderRadius: '10px',
                            margin: '20px',
                            justifyContent: 'center',
                            padding: '5px'
                        }}
                    >
                        <a href='#' className={styles.templateAnchor}>

                            <div className={styles.qrModalHeader}>Like it? Click to download!</div>
                            <img
                                src={this.state.compositeUrl}
                                width={this.state.selectedDims?.size.x * this.state.selectedDims?.scale}
                                height={this.state.selectedDims?.size.y * this.state.selectedDims?.scale}
                                onClick={() => this.downloadSelectedTemplate()}
                            />
                        </a>

                    </Modal>
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
                                QR Templates (click to download)
                            </th>
                            <th>
                                Menu Link
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.sublocations.map((sublocation) => {
                            if (sublocation.active)
                                return sublocationRow(sublocation.name, sublocation.color, sublocation.id, sublocation.menu)
                        })}
                        </tbody>
                    </Table>
                </div>
            )
        }

        return (
            <div className={styles.qrManagementBlock}>
                <div className="container-fluid text-wrap" id={styles.qrManagementContainer}>
                    <h2 id={styles.qrHeader}>QR Code Management</h2>
                    <p>You can use a single QR code for the whole restaurant, or you can create multiple QR codes to
                        gain more
                        targeted insights. Please link your menu to your QR codes in the Menu Management tab above.</p>
                    <lh id={styles.listHeader}>Examples</lh>
                    <ul>
                        <li>Use distinct QR codes for indoor and outdoor tables</li>
                        <li>Use distinct QR codes for each individual table</li>
                    </ul>
                    <Row>
                        <Col>
                            <AddNewSublocation sublocations={this.state.sublocations} handleSubmit={this.addSublocation}
                                               menus={this.state.menus}/>
                        </Col>
                    </Row>
                    {sublocationtable()}
                    <Row>
                        <Col>
                            <DeleteSublocation sublocations={this.state.sublocations}
                                               handleSubmit={this.deleteSublocation}/>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
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
                        menu: this.props.menus && this.props.menus.length ? 'select' : 'none'
                    }}
                    validate={(values) => {
                        let errors = {}
                        if (!values.name)
                            errors.name = "You must name your QR code."
                        else
                            for (let i = 0; i < this.props.sublocations.length; ++i)
                                if (values.name.toLowerCase() === this.props.sublocations[i].name.toLowerCase())
                                    if (this.props.sublocations[i].active)
                                        errors.name = "This QR code name exists already"

                        return errors;
                    }}
                >
                    <Form className={styles.qrCodeGeneratorWrapper}>
                        <Row>
                            <Col className={styles.qrCodeFormColumn}>
                                <div className="form-group" class="column-contents">
                                    <label className={styles.qrField}>Name </label>
                                    <Field type="input" name="name" class="form-control"/>
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
                            <Col>
                                <div className="form-group" class="column-contents">
                                    <label className={styles.qrField}>Menu </label>
                                    <Field as="select" name="menu" class="form-control">
                                        <option value="select">Select</option>
                                        {!this.props.menus ? "" :
                                            this.props.menus.map((menu) => {
                                                return (<option value={JSON.stringify(menu)}
                                                                key={menu.name}>{menu.name}</option>)
                                            })}
                                        <option value="none">No Menu</option>
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
        return (
            <div>
                <h4 className={styles.qrCodeSubheader}>Delete QR Code</h4>
                <Formik
                    initialValues={{
                        code: 'none'
                    }}
                    onSubmit={(values) => this.props.handleSubmit(values.code)}
                    validate={(values) => {
                        let errors = {}
                        if (values.code === 'none')
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
                                        <option value={'none'}>Select</option>
                                        {this.props.sublocations.map((sublocation) => {
                                            if (sublocation.active) {
                                                return (
                                                    <option value={sublocation.name}>{sublocation.name}</option>
                                                );
                                            }
                                            return (<div></div>);
                                        })}
                                    </Field>
                                </div>
                            </Col>
                            <Col className={styles.qrCodeFormColumn}>
                                <Button variant="danger" className={styles.deleteQrCodeSubmit}
                                        type="submit">Delete</Button>
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
