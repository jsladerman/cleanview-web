import React, {Component } from 'react';
import './css/QRCodeGenerator.css'
class QRCodeGenerator extends Component {
  // TODO: GET URL FROM DB, NOT PASSED IN AS PROP
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      url: "https://api.qrserver.com/v1/create-qr-code/?data=https://b4fxzcx3f0.execute-api.us-east-1.amazonaws.com/dev/survey/" + this.props.id,
    };
    console.log(this.state.url)
  }

  downloadQRCode = () => {
    fetch(this.url + "&size=500x500")
    .then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "qr_code_" + this.state.name + ".jpg";
        a.click();
      });
    });
  };

  render() {
    return (
      <div id="qr-code-block">
          <h3>Here is the QR code for your survey (click to download):</h3>
          <a href="#">
            <img src={this.state.url + "&size=100x100"} alt="" title="" onClick={this.downloadQRCode}/>
          </a>
      </div>
    );
  }
}

export default QRCodeGenerator;
