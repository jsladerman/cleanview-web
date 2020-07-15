/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	
Amplify Params - DO NOT EDIT */

const AWS = require("aws-sdk");
var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");



// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

let tableName = "locations";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/**********************
 * Example get method *
 **********************/

app.get("/survey", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

app.get("/survey/:id", function (req, res) {
  // TODO : sanitize input
  const { id } = req.params;
  console.log(id);
  var params = {
    TableName: tableName,
    ProjectionExpression: "id, loc_name",
    Key: { "id": id },
  };

  dynamodb.get(params, function (err, data) {
    if (err) {
      console.error("Error:", JSON.stringify(err, null, 2));
      res.send(`<!DOCTYPE html>
          <head>
              <title>Re-scan QR code</title>
          </head>
          <body>
              <h1>Sorry, we've hit a snag.</h1>
              <h2>Please re-scan the QR code.</h2>
          </body>`);
    } else if (!data.Item.loc_name) {
      console.error("Data error:", JSON.stringify(data, null, 2));
      res.send(`<!DOCTYPE html>
          <head>
              <title>Re-scan QR code</title>
          </head>
          <body>
              <h1>Sorry, we've hit a snag.</h1>
              <h2>Please re-scan the QR code.</h2>
          </body>`);
    }else {
      console.log(data)
      let itemData = data.Item
      let name = itemData.loc_name;
      res.send(`<!doctype html>
<html ⚡>
  <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <title>CleanView</title>
    <link rel="canonical" href="https://amp.dev/documentation/guides-and-tutorials/start/create/basic_markup/">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,500;0,600;1,600&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <script type="application/ld+json">
      {
        "@context": "http://schema.org",
        "@type": "NewsArticle",
        "headline": "Open-source framework for publishing content",
        "datePublished": "2015-10-07T12:02:41Z",
        "image": [
          "logo.jpg"
        ]
      }
    </script>
    <script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>
    <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <script async custom-element="amp-selector" src="https://cdn.ampproject.org/v0/amp-selector-0.1.js"></script>
    <style amp-custom>
        body {
            background-color: #23A6BD;
        }
        h1 {
            margin-left: 20px;
            margin-right: auto;
            color: white;
            padding: 0;
            font-family: 'Open sans', sans-serif;
            width: 90%;
        }
        label {
            color: white;
            font-size: x-large;
            font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            text-indent: 0px;
        }
        h2 {
            padding-left: 20px;
            color: white;
            font-size: x-large;
            font-family: 'Work Sans', sans-serif;
            text-indent: 0px;
        }
        button {
            font-size: larger;
            padding: 5px;
            background-color: #00086A;
            color: white;
            text-align: center;
            border-radius: 8px;
            margin: 2px;
            border: solid navy;
            font-family: 'Work Sans', sans-serif;   
        }
        amp-selector {
            padding-top: 0px;
        }

    </style>
</head>
  <body>
    <h1>Help <strong>${name}</strong> learn about their COVID-19 response:</h1>
    <br/>
    <form class="user-survey" method="post" action-xhr="..."> 
        <div style="padding-right: 20px">
            <h2>How old are you?</h2>
            <amp-selector style="padding-left: 20px" class="age-selector" layout="container">
                <button type='button' option="1">18 to 25</button>
                <button type='button' option="3">26 to 35</button>
                <button type='button' option="4">36 to 45</button>
                <button type='button' option="5">46 to 55</button>
                <button type='button' option="6">55 to 65</button>
                <button type='button' option="7">65+</button>
            </amp-selector>
        </div>
        <div style="padding-top: 10px; padding-right: 20px">
            <h2>Are the employees wearing masks?</h2>
            <amp-selector style="padding-left: 20px" class="mask-selector" layout="container">
                <button type='button' option="y">Yes</button>
                <button type='button' option="n">No</button>
            </amp-selector>
        </div>

        <div style="padding-top: 20px; padding-right: 20px">
            <h2>Have you dined here in the past two weeks?</h2>
            <amp-selector style="padding-left: 20px" class="mask-selector" layout="container">
                <button type='button' option="y">Yes</button>
                <button type='button' option="n">No</button>
            </amp-selector>
        </div>
          
        <div style="padding-top: 20px; padding-right: 20px; padding-bottom: 50px;">
            <h2>How safe do you feel here?</h2>
            <label style="margin-left: 20px">Unsafe</label>
            <input type="range" id="slider" name="volume" min="1" max="5" step=".5" >
            <label>Safe</label>
        </div>
    </form>
  </body>
</html>
    `);
    }
  });
});

/****************************
 * Example post method *
 ****************************/

app.post("/survey", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

app.post("/survey/*", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example put method *
 ****************************/

app.put("/survey", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/survey/*", function (req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/survey", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/survey/*", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
