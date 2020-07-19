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
  var params = {
    TableName: tableName,
    ProjectionExpression: "id, loc_name",
    Key: { "id": id },
  };

  dynamodb.get(params, function (err, data) {
    if (err) {
      res.send(`<!DOCTYPE html>
          <head>
              <title>Re-scan QR code</title>
          </head>
          <body>
              <h1>Sorry, we've hit a snag.</h1>
              <h2>Please re-scan the QR code.</h2>
          </body>`);
    } else if (!data.Item.loc_name) {
      res.send(`<!DOCTYPE html>
          <head>
              <title>Re-scan QR code</title>
          </head>
          <body>
              <h1>Sorry, we've hit a snag.</h1>
              <h2>Please re-scan the QR code.</h2>
          </body>`);
    }else {
      let itemData = data.Item
      let name = itemData.loc_name;
      let loc_id = itemData.id
      res.send(`<!doctype html>
<html ⚡>
  <head>
    <meta charset='utf-8'>
    <script async src='https://cdn.ampproject.org/v0.js'></script>
    <title>CleanView</title>
    <link rel='canonical' href='https://amp.dev/documentation/guides-and-tutorials/start/create/basic_markup/'>
    <link href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;700&display=swap' rel='stylesheet'>
    <link href='https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,500;0,600;1,600&display=swap' rel='stylesheet'>
    <meta name='viewport' content='width=device-width,minimum-scale=1,initial-scale=1'>
    <script type='application/ld+json'>
      {
        '@context': 'http://schema.org',
        '@type': 'NewsArticle',
        'headline': 'Open-source framework for publishing content',
        'datePublished': '2015-10-07T12:02:41Z',
        'image': [
          'logo.jpg'
        ]
      }
    </script>
    <script async custom-element='amp-form' src='https://cdn.ampproject.org/v0/amp-form-0.1.js'></script>
    <script async custom-template='amp-mustache' src='https://cdn.ampproject.org/v0/amp-mustache-0.2.js'></script>
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <script async custom-element='amp-selector' src='https://cdn.ampproject.org/v0/amp-selector-0.1.js'></script>
    <script type='text/javascript'>
            function sayHello() {
               alert('Hello World')
            }

    </script>
    <style amp-custom>
        
    </style>
</head>
  <body>
    <h1>Help <strong>${name}</strong> learn about their COVID-19 response:</h1>
    <form class='user-survey' method='POST' action-xhr=https://b4fxzcx3f0.execute-api.us-east-1.amazonaws.com/dev/responses target="_top"> 
        <fieldset>
        <div>
            <input type='hidden' name='loc_id' value='${loc_id}'> </input>
            <p>How old are you?</p>
            <amp-selector name='age' class='age-selector' layout='container' on='select: AMP.setState({
                selectedOption: event.targetOption,
                allSelectedOptions: event.selectedOptions
              })'>
                <span class='selection-button' option='1'>18 to 25</span>
                <span type='selection-button' option='2'>26 to 35</span>
                <span type='selection-button' option='3'>36 to 45</span>
                <span type='selection-button' option='4'>46 to 55</span>
                <span type='selection-button' option='5'>55 to 65</span>
                <span type='selection-button' option='6'>65+</span>
            </amp-selector>
        </div>
        <div>
            <p>Are the employees wearing masks?</p>
            <amp-selector class='mask-selector' layout='container' name='employee-masks'>
                <span class='selection-button' option='y'>Yes</span>
                <span class='selection-button' option='n'>No</span>
            </amp-selector>
        </div>

        <div>
            <p>Have you dined here in the past two weeks?</p>
            <amp-selector class='mask-selector' layout='container' name='recent-diner'>
                <span class='selection-button' option='y'>Yes</span>
                <span class='selection-button' option='n'>No</span>
            </amp-selector>
        </div>
          
        <div>
            <p>How safe do you feel here?</p>
            <label>Unsafe</label>
            <input type='range' id='slider' name='safety-rating' min='1' max='5' step='.5' >
            <label>Safe</label>
        </div>
        <input type='submit' value='Submit and go to menu'></input>
        </fieldset>
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
