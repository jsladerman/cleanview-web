/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "locations";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

let responseUrl = "https://d9uqja1id6.execute-api.us-east-1.amazonaws.com/dev"
if(process.ENV === 'dev') {
  responseUrl = "https://d9uqja1id6.execute-api.us-east-1.amazonaws.com/dev"
} else if(process.env.ENV === 'develop') {
  responseUrl = "https://tsro629xid.execute-api.us-east-1.amazonaws.com/develop"
} else if(process.env.ENV === 'staging') {
  responseUrl = "https://n4ye0be6kd.execute-api.us-east-1.amazonaws.com/staging"
} else if(process.env.ENV === 'prod') {
  responseUrl = "https://pk58tyr64h.execute-api.us-east-1.amazonaws.com/prod"
}


let scanQrUrl = "https://5godqzx0d7.execute-api.us-east-1.amazonaws.com/dev"
if(process.ENV === 'dev') {
  scanQrUrl = "https://5godqzx0d7.execute-api.us-east-1.amazonaws.com/dev"
} else if(process.env.ENV === 'develop') {
  scanQrUrl = "https://tsro629xid.execute-api.us-east-1.amazonaws.com/develop"
} else if(process.env.ENV === 'staging') {
  scanQrUrl = "https://n4ye0be6kd.execute-api.us-east-1.amazonaws.com/staging"
} else if(process.env.ENV === 'prod') {
  scanQrUrl = "https://pk58tyr64h.execute-api.us-east-1.amazonaws.com/prod"
}


const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "id";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/landing";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + "/:id", function(req, res) {
  const { id } = req.params;
  // loc_id + '99strl99strl' + subloc_id = id
  const divisionIdx = id.indexOf('99strl99strl')
  const locationId = id.substring(0, divisionIdx)
  const sublocationId = id.substring(divisionIdx + ('99strl99strl').length)

  var params = {
    TableName: tableName,
    // Use below when schedules are implemented and there is a bool for survey or not
    ProjectionExpression: 'loc_name, menus, survey',
    Key: { "id": locationId } 
  }

  // TODO: see line 268 of CreateSurveyLambda with link rel canonical
  dynamodb.get(params, function(err, data) {
    if(err) {
      console.log("Error", err)
      res.send(`<!DOCTYPE html>
          <head>
              <title>Re-scan QR code</title>
          </head>
          <body>
              <h1>Sorry, we've hit a snag.</h1>
              <h2>Please re-scan the QR code.</h2>
              <p>${id}</p>
              <p>${locationId}</p>
              <p>${sublocationId}</p>
              <p>${err}</p>
          </body>`);
    } else if(!data.Item || !data.Item.menus) {
      console.log("Data error", data)
      res.send(`<!DOCTYPE html>
          <head>
              <title>Re-scan QR code</title>
          </head>
          <body>
              <h1>Sorry, we've hit a snag.</h1>
              <h2>Please re-scan the QR code.</h2>
              <p>${id}</p>
              <p>${locationId}</p>
              <p>${sublocationId}</p>
          </body>`);
    } else {
      let itemData = data.Item;
      let survey = itemData.survey ? itemData.survey : false;
      let noSurveyIdx = id.indexOf('&nosurvey')
      if(noSurveyIdx > -1)
        survey = false
      
      if(survey) {
        let itemData = data.Item;
      let name = itemData.loc_name;
      let menus = itemData.menus ? itemData.menus : []
      let redirectLink = scanQrUrl + '/landing/' + id + '&nosurvey'

      let defaultLang = Boolean(itemData.defaultLang) ? itemData.defaultLang : 'en';
      let hasMenuLink = Boolean(menus.length > 0);
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
        <link rel='canonical' href='${scanQrUrl}/landing/${id}'>
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
        <form class='user-survey' method='POST' action-xhr="${responseUrl}/response" target="_top">
          <fieldset>
            <div>
              <input type='hidden' name='sublocId' value='${sublocationId}'> </input>
              <input type='hidden' name='locationId' value='${locationId}'></input>
              <input type='hidden' name='menuLink' value='${redirectLink}'> </input>
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
      
            <div id='submit-button-div'>
              <input id='submission' type='submit'></input>
            </div>
      
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
      } else {
        let menus = itemData.menus;
        console.log("Menus", menus)
        let buttonSetStr = `let buttonSet = document.getElementById("buttonSet"); let a, text, d;`;
        for(let i=0; i<menus.length; ++i) {
          buttonSetStr += `d = document.createElement('div');`
          buttonSetStr += `a = document.createElement('a');`
          buttonSetStr += `text = document.createTextNode('${menus[i].name}');`
          buttonSetStr += `a.appendChild(text);`
          buttonSetStr += `a.title = '${menus[i].name}';`
          buttonSetStr += `a.href = '${menus[i].url}';`
          buttonSetStr += `d.appendChild(a);`
          buttonSetStr += `buttonSet.appendChild(d);`
        }
        res.send(`
        <!DOCTYPE html>
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
        <style amp-custom>
      
        </style>
      </head>
      <body >
      <div id='buttonSet'></div>
      </body>
      <script>
            ${buttonSetStr}
      </script>
      </html>
        `);
      }
    }
  })
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
