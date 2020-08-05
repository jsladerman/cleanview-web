import React, { Component } from "react";
import EditLocationInfo from "./EditLocationInfo";
import styles from "./css/LocationInfo.module.css";
import Container from "react-bootstrap/Container";
import Modal from "@trendmicro/react-modal";
import ClickableOverlay from "../Custom/ClickableOverlay";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import API from "@aws-amplify/api";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";
import {BsPencil} from "react-icons/bs";

class LocationInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null,
      data: this.props.data,
      showModal: false,
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  handleUpdate = async () => {
    this.toggleModal();
    this.props.handleUpdate();
    this.loadData();
  };

  handleDelete = async () => {
    this.toggleModal();
    this.props.handleUpdate();
    this.setState({ redirect: '/home/locations' });
  }

  loadData = () => {
    const apiName = "ManageLocationApi";
    const path = "/location/object";
    const requestData = {
      headers: {},
      response: true,
      queryStringParameters: {
        id: this.props.data.id,
      },
    };

    API.get(apiName, path, requestData)
      .then((response) => {
        let currState = this.state;
        currState.data = response.data.body;
        this.setState(currState);
      })
      .catch((error) => {
        console.log("Error: " + error);
      });
  };

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  covidResponseField = (
    labelText,
    valueText,
    titleStyleClassName,
    dataStyleClassName
  ) => {
    return (
      <p className={dataStyleClassName}>
        <span className={titleStyleClassName}>{labelText + " "} </span>{" "}
        {valueText}
      </p>
    );
  };

  intToYN = (i) => {
    if (!i) {
      return "No";
    }
    return "Yes";
  };

  formatBusinessType = () => {
    let business_type_format = "";
    if (this.state.data.loc_type.length === 1) {
      business_type_format = this.state.data.loc_type[0].toUpperCase();
    } else if (this.state.data.loc_type) {
      business_type_format =
        this.state.data.loc_type[0].toUpperCase() +
        this.state.data.loc_type.slice(1);
    }
    return business_type_format;
  };

  formatPhone = (n) => {
    const area = n.substring(0, 3);
    const secondSet = n.substring(3, 6);
    const thirdSet = n.substring(6);
    const res = "(" + area + ") " + secondSet + "-" + thirdSet;
    return res;
  };

  ynCharToString = (c) => {
    if (c === "y") {
      return "Yes";
    } else if (c === "n") {
      return "No";
    }
    return c;
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />
    }
    const businessType = this.formatBusinessType();
    const businessEmail = this.state.data.email;
    const businessPhone = this.state.data.phone;

    const imgSrc =
      this.state.data.imageUrl != null
        ? this.state.data.imageUrl
        : require("../../images/exampleRestaurant.png");

    const covidResponseFieldDataCol1 = [
      {
        text: "Are your employees required to wear masks?",
        value: this.ynCharToString(
          this.state.data.covidResponseSurvey.employeeMasks
        ),
        titleStyleClass: styles.covidResponseFieldTitle,
        dataStyleClass: styles.covidResponseFieldData,
      },
      {
        text: "Do you enforce social distancing guidelines?",
        value: this.ynCharToString(
          this.state.data.covidResponseSurvey.socialDistancing
        ),
        titleStyleClass: styles.covidResponseFieldTitle,
        dataStyleClass: styles.covidResponseFieldData,
      },
      {
        text: "Do you sanitize tables after every meal?",
        value: this.ynCharToString(
          this.state.data.covidResponseSurvey.sanitizeTables
        ),
        titleStyleClass: styles.covidResponseFieldTitle,
        dataStyleClass: styles.covidResponseFieldData,
      },
      {
        text: "Do you take the temperature of your employees every day?",
        value: this.ynCharToString(
          this.state.data.covidResponseSurvey.employeeTemp
        ),
        titleStyleClass: styles.covidResponseFieldTitle,
        dataStyleClass: styles.covidResponseFieldData,
      },
    ];

    const covidResponseFieldDataCol2 = [
      {
        text: "Do you have outside seating?",
        value: this.ynCharToString(
          this.state.data.covidResponseSurvey.outsideSeating
        ),
        titleStyleClass: styles.covidResponseFieldTitle,
        dataStyleClass: styles.covidResponseFieldData,
      },
      {
        text: "What is your indoor capacity?",
        value: this.state.data.covidResponseSurvey.indoorCapacity,
        titleStyleClass: styles.covidResponseFieldTitle,
        dataStyleClass: styles.covidResponseFieldData,
      },
      {
        text: "What is your outdoor capacity (if applicable)?",
        value:
          this.state.data.covidResponseSurvey.outdoorCapacity === ""
            ? "N/A"
            : this.state.data.covidResponseSurvey.outdoorCapacity,
        titleStyleClass: styles.covidResponseFieldTitle,
        dataStyleClass: styles.covidResponseFieldData,
      },
    ];

    const covidResponseFieldsCol1 = covidResponseFieldDataCol1.map((field) =>
      this.covidResponseField(
        field.text,
        field.value,
        field.titleStyleClass,
        field.dataStyleClass
      )
    );

    const covidResponseFieldsCol2 = covidResponseFieldDataCol2.map((field) =>
      this.covidResponseField(
        field.text,
        field.value,
        field.titleStyleClass,
        field.dataStyleClass
      )
    );

    const businessInformation = (
      <div className={styles.locationInfoFields}>
        <p>
          <span className={styles.locationInfoFieldName}>Business Type: </span>{" "}
          {businessType}
        </p>
        <p>
          <span className={styles.locationInfoFieldName}>Email: </span>{" "}
          {businessEmail}
        </p>
        <p>
          <span className={styles.locationInfoFieldName}>Phone: </span>{" "}
          {this.formatPhone(businessPhone)}
        </p>
        {/* TODO: Format below so it's aligned with the rest
                  Also format the text so the first letter of city is capital*/}
        <p>
          <span className={styles.locationInfoFieldName}>Address: </span>
          {this.state.data.addrLine1}
          {" " + this.state.data.addrLine2}
          <br />
          <span className={styles.addrBlock}>
            {this.state.data.addrCity}, {this.state.data.addrState},{" "}
            {this.state.data.addrZip}
          </span>
        </p>
      </div>
    );

    return (
      <div>
        <Modal
          show={this.state.showModal}
          onClose={this.toggleModal}
          showCloseButton={true}
          style={{ borderRadius: "100px" }}
        >
          <EditLocationInfo
            data={this.state.data}
            handleUpdate={this.handleUpdate}
            handleDelete={this.handleDelete}
          />
        </Modal>
        <div className={styles.locationInfoWrapper}>
          <Container fluid className={styles.locationInfoContainer}>
            <Row>
              <Col>
                <h2>{this.state.data.loc_name} 
                <span onClick={this.toggleModal}><BsPencil className={styles.editButton}/></span>
                </h2>
              </Col>
            </Row>
            <Row>
              <h6 className={styles.subtitle}>
                This page is how your location will be displayed on our coming-soon consumer information platform.
              </h6>
            </Row>
            <Row>
              <Col>
                <Card.Img
                  variant="top"
                  style={{ borderRadius: "8px" }}
                  src={imgSrc}
                />
              </Col>
              <Col className={styles.thirdColumn}>{businessInformation}</Col>
              <Col>
              </Col>
            </Row>
            <Row>
              <Col>
                <h5 className={styles.covidResponseTitle}>
                  {" "}
                  Your self-reported COVID-19 health practices:{" "}
                </h5>
              </Col>
            </Row>
            <Row className={styles.coividResponseRow}>
              <Col md="auto">{covidResponseFieldsCol1}</Col>
              <Col>{covidResponseFieldsCol2}</Col>
              <Col> </Col>
            </Row>
            <Row>
              <Col>
                {" "}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default LocationInfo;
