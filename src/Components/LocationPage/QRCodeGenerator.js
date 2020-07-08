import React, {Component } from 'react';

class QRCodeGenerator extends Component {
  constructor() {
    super();
    this.state = {
      name: "CleanView",
      data: "cleanview.io",
    };
  }

  downloadQRCode = () => {
    fetch(
      "https://api.qrserver.com/v1/create-qr-code/?data=" +
        this.state.data +
        "&size=500x500"
    ).then((response) => {
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
      <div id="container">
        <button onClick={this.downloadQRCode}>Download QR Code!</button>
      </div>
    );
  }
}

export default QRCodeGenerator;
