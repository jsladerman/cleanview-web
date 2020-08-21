/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
  STORAGE_LOCATIONS_ARN
  STORAGE_LOCATIONS_NAME
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

// HARD CODED: url endpoints
let environmentURL = "https://d9uqja1id6.execute-api.us-east-1.amazonaws.com/dev"
if(process.ENV === 'dev') {
  environmentURL = "https://d9uqja1id6.execute-api.us-east-1.amazonaws.com/dev"
} else if(process.env.ENV === 'develop') {
  environmentURL = "https://tsro629xid.execute-api.us-east-1.amazonaws.com/develop"
} else if(process.env.ENV === 'staging') {
  environmentURL = "https://n4ye0be6kd.execute-api.us-east-1.amazonaws.com/staging"
} else if(process.env.ENV === 'prod') {
  environmentURL = "https://pk58tyr64h.execute-api.us-east-1.amazonaws.com/prod"
}

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

/**
 * Generate Survey based on specific total_id
 */

app.get("/survey/:id", function (req, res) {
  // TODO : sanitize input
  const { id } = req.params;
  // the original location id, by UUID standards, is the first 36 characters of the total_id (tot_id)
  // loc_id + '99strl99strl' + subloc_id = total_id
  const tot_id = id
  const divIdx = tot_id.indexOf('99strl99strl')
  const menuIdx = tot_id.indexOf('99menu99')
  const loc_id = tot_id.substring(0, divIdx)
  const sub_id = tot_id.substring(divIdx + ('99strl99strl').length, menuIdx)
  const menuName = tot_id.substring(menuIdx + ('99menu99').length)

  var params = {
    TableName: tableName,
    ProjectionExpression: "loc_name, menus",
    Key: { "id": loc_id },
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
              <p>${tot_id}</p>
              <p>${loc_id}</p>
              <p>${err}</p>
          </body>`);
    } else if (!data.Item || !data.Item.loc_name) {
      res.send(`<!DOCTYPE html>
          <head>
              <title>Re-scan QR code</title>
          </head>
          <body>
              <h1>Sorry, we've hit a snag.</h1>
              <h2>Please re-scan the QR code.</h2>
              <p>${tot_id}</p>
              <p>${loc_id}</p>
              <p>${data}</p>
          </body>`);
    }else {
      let itemData = data.Item;
      let name = itemData.loc_name;
      let menus = itemData.menus
      let menu_link = 'https://www.cleanview.io';
      for(let i=0; i<menus.length; ++i) {
        if(menus[i].name.toLowerCase().trim() === menuName.toLowerCase().trim()) {
          menu_link = menus[i].url
          break
        }
      }

      let defaultLang = Boolean(itemData.defaultLang) ? itemData.defaultLang : 'en';
      let hasMenuLink = Boolean(menu_link !== 'https://www.cleanview.io');
      res.send(`<!doctype html>
      <html ⚡>
      
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
      
        <style>
          html {
            background-color: #E5E5E5;
            font-family: Roboto;
            height: 100%;
          }
      
          .header {
            background-color: #191A26;
            margin: 0px 0px 0px 0px;
            padding: 20px 0px 0px 20px;
            font-size: 24px;
            color: white;
            font-weight: normal;
          }
      
          .language-button {
            color: white;
            font-size: 12px;
            padding: 10px 0px 10px 0px;
          }
      
          fieldset {
            border-style: none;
            padding-left: 20px;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
          }
      
          label {
            font-size: 16px;
          }
      
          p {
            font-size: 16px;
            margin: 5px 0px 5px 0px;
          }
      
          .age-selector {
            justify-items: center;
            align-items: center;
          }
      
          .selection-button {
            /* Button design */
            background-color: #ffffff;
            border-radius: 10px;
            position: relative;
            display: inline-block;
            cursor: pointer;
            width: 58px;
      
            /* Text properties */
            color: #666666;
            font-size: 14px;
            padding: 8px 10px;
            text-align: center;
      
            /* Buttons which wrap to the next line will have spacing between top line */
            margin: 0px 0px 10px 0px;
          }
      
          .selection-button:hover {
            background: linear-gradient(to bottom, #f6f6f6 5%, #ffffff 100%);
            background-color: #f6f6f6;
          }
      
          #under-12 {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
      
            /* Button design */
            border: none;
            background-color: #ffffff;
            border-radius: 10px;
            position: relative;
            display: inline-block;
            cursor: pointer;
            width: 79px;
      
            /* Text properties */
            color: #666666;
            font-size: 12px;
            font-weight: normal;
            padding: 9px 5px;
            text-align: center;
      
            /* Buttons which wrap to the next line will have spacing between top line */
            margin: 0px 0px 10px 0px;
          }
      
          #under-12:hover {
            background: linear-gradient(to bottom, #f6f6f6 5%, #ffffff 100%);
            background-color: #f6f6f6;
          }
      
          amp-selector [option][selected] {
            outline: 0px;
            background: #23C9AD;
            font-weight: normal;
            color: white;
            position: relative;
          }
      
          #submission {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
      
            /* Button design */
            border: none;
            background-color: #23C9AD;
            border-radius: 10px;
            display: inline-block;
            cursor: pointer;
            width: 200px;
      
            /* Text properties */
            color: #ffffff;
            font-size: 16px;
            padding: 8px 10px;
            text-align: center;
      
            /* Buttons which wrap to the next line will have spacing between top line */
            margin: 0px 0px 10px 0px;
          }
      
          #submission:hover {
            background-color: #119c84;
          }
      
          #submission:active {
            outline: 0px;
            background: #119c84;
            font-weight: normal;
            color: #ffffff;
          }
      
          #submit-button-div {
            position: relative;
            margin-bottom: 10%;
            padding-top: 20px;
            text-align: center;
          }
        </style>
      
        <meta charset='utf-8'>
        <script async src='https://cdn.ampproject.org/v0.js'></script>
        <title>CleanView</title>
        <link rel='canonical' href='${environmentURL}/survey/${tot_id}'>
        <link href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;700&display=swap' rel='stylesheet'>
        <link href='https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,500;0,600;1,600&display=swap'
          rel='stylesheet'>
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
        <style amp-boilerplate>
          body {
            -webkit-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
            -moz-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
            -ms-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
            animation: -amp-start 8s steps(1, end) 0s 1 normal both
          }
      
          @-webkit-keyframes -amp-start {
            from {
              visibility: hidden
            }
      
            to {
              visibility: visible
            }
          }
      
          @-moz-keyframes -amp-start {
            from {
              visibility: hidden
            }
      
            to {
              visibility: visible
            }
          }
      
          @-ms-keyframes -amp-start {
            from {
              visibility: hidden
            }
      
            to {
              visibility: visible
            }
          }
      
          @-o-keyframes -amp-start {
            from {
              visibility: hidden
            }
      
            to {
              visibility: visible
            }
          }
      
          @keyframes -amp-start {
            from {
              visibility: hidden
            }
      
            to {
              visibility: visible
            }
          }
        </style><noscript>
          <style amp-boilerplate>
            body {
              -webkit-animation: none;
              -moz-animation: none;
              -ms-animation: none;
              animation: none
            }
          </style>
        </noscript>
        <script async custom-element='amp-selector' src='https://cdn.ampproject.org/v0/amp-selector-0.1.js'></script>
        <script type='text/javascript'>
          function sayHello() {
            alert('Hello World')
          }
      
        </script>
        <style amp-custom>
      
        </style>
      </head>
      
      <body onload="popLang('${defaultLang}');">
        <div class="header">
          <div id="learn"></div>
          <div class='language-button' id="langChange" onclick='popLangOther()'></div>
        </div>
        <form class='user-survey' method='POST' action-xhr="${environmentURL}/response" target="_top">
          <fieldset>
            <div>
      
              <input type='hidden' name='sublocId' value='${sub_id}'> </input>
              <input type='hidden' name='locationId' value='${loc_id}'></input>
              <input type='hidden' name='menuLink' value='${menu_link}'> </input>
              <input id="timestamp" type='hidden' name='timestamp'></input>
              <input id="weekday" type='hidden' name='weekday'></input>
              <div>
                <p id="masks"></p>
                <amp-selector class='mask-selector' layout='container' name='employeeMasks'>
                  <span class='selection-button' option='1' id="masksYes"></span>
                  <span class='selection-button' option='0' id="masksNo"></span>
                </amp-selector>
              </div>
              <div>
                <p id="distanced"></p>
                <amp-selector class='six-feet-selector' layout='container' name='sixFeet'>
                  <span class='selection-button' option='1' id="distancedYes"></span>
                  <span class='selection-button' option='0' id="distancedNo"></span>
                </amp-selector>
              </div>
              <p id="age"></p>
              <amp-selector name='age' class='age-selector' layout='container' on='select: AMP.setState({
                            selectedOption: event.targetOption,
                            allSelectedOptions: event.selectedOptions
                          })'>
                <span option='young'><input id='under-12' type='submit'></input></span>
                <span class='selection-button' option='13-17'>13-17</span>
                <span class='selection-button' option='18-25'>18-25</span>
                <span class='selection-button' option='26-35'>26-35</span>
                <span class='selection-button' option='36-45'>36-45</span>
                <span class='selection-button' option='46-55'>46-55</span>
                <span class='selection-button' option='56-65'>56-65</span>
                <span class='selection-button' option='66+'>66+</span>
              </amp-selector>
            </div>
      
      
            <div>
              <p id="local"></p>
              <amp-selector class='tourist-selector' layout='container' name='touristDiner'>
                <span class='selection-button' option='1' id="localYes"></span>
                <span class='selection-button' option='0' id="localNo"></span>
              </amp-selector>
            </div>
      
            <div>
              <p id="overallRating"></p>
              <label id="poor"></label>
              <input type='hidden' id='ratingValid' name='ratingValid' value='0'></input>
              <input type='range' id='slider' name='responseRating' min='0' max='5'
                oninput='document.getElementById(\"ratingValid\").value = 1' step='.5'></input>
              <label id="excellent"></label>
            </div>
      
            <div id='submit-button-div'><input id='submission' type='submit'></input></div>
      
          </fieldset>
        </form>
      </body>
      <script>
        let curDate = Date().toLocaleString();
        document.getElementById("timestamp").value = curDate.substring(4);
        document.getElementById("weekday").value = curDate.substring(0, 3);
      
        const enText = {
          langChange: "<strong><u>english</u></strong> | español",
          underThirteen: "Under 13",
          learn: "Help <strong>${name}</strong> learn about their COVID-19 response:",
          y: "Yes",
          n: "No",
          masks: "Are the employees wearing masks?",
          socialDistancing: "Is your party at least 6 feet away from other parties?",
          age: "What is your age group?",
          local: "Do you live within 15 miles of the restaurant?",
          overall: "How satisfied are you with ${name}'s overall COVID-19 response?",
          poor: "Poor",
          excellent: "Excellent",
          goToMenu: Boolean(${hasMenuLink}) ? "Go to menu" : "Submit"
        }
      
        const esText = {
          langChange: "english | <strong><u>español</u></strong>",
          underThirteen: "Menos de 13",
          learn: "Ayuda a <strong>${name}</strong> aprende sobre su respuesta de COVID-19: ",
          y: "Sí",
          n: "No",
          masks: "¿Los empleados están usanda máscaras?",
          socialDistancing: "¿Su grupo está por lo menos a 6 pies de distancia?",
          age: "¿Cuál es su grupo de edad?",
          local: "¿Vive a 15 millas o menos del restaurante?",
          overall: "¿Qué tan satisfecho está con la respuesta que ha tenido ${name} con COVID-19?",
          poor: "Malo",
          excellent: "Excelente",
          goToMenu: Boolean(${hasMenuLink}) ? "Ir al menú" : "Enviar"
        }
      
        var curLang;
      
        function popLangOther() {
          if (curLang == 'en') {
            popLang('es')
          } else {
            popLang('en')
          }
        }
      
        function popLang(langId) {
          curLang = langId;
          var chosenText = langId === 'en' ? enText : esText
          document.getElementById("under-12").value = chosenText.underThirteen
          document.getElementById("langChange").innerHTML = chosenText.langChange
          document.getElementById("learn").innerHTML = chosenText.learn
          document.getElementById("masks").innerHTML = chosenText.masks
          document.getElementById("masksYes").innerHTML = chosenText.y
          document.getElementById("masksNo").innerHTML = chosenText.n
          document.getElementById("distanced").innerHTML = chosenText.socialDistancing
          document.getElementById("distancedYes").innerHTML = chosenText.y
          document.getElementById("distancedNo").innerHTML = chosenText.n
          document.getElementById("age").innerHTML = chosenText.age
          document.getElementById("local").innerHTML = chosenText.local
          document.getElementById("localYes").innerHTML = chosenText.y
          document.getElementById("localNo").innerHTML = chosenText.n
          document.getElementById("overallRating").innerHTML = chosenText.overall
          document.getElementById("poor").innerHTML = chosenText.poor
          document.getElementById("excellent").innerHTML = chosenText.excellent
          document.getElementById("submission").value = chosenText.goToMenu
        }
      
      </script>
      
      </html>
    `);
    }
  });
});

app.get('/survey/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/survey', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/survey/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/survey', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/survey/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/survey', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/survey/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app


