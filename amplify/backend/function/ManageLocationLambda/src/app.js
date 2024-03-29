/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
const { uuid } = require('uuidv4')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
var mergeImages = require('merge-images');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "locations";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

// scanQr endpoint
// HARD CODED: url endpoints
let environmentURLSurvey = "https://nshroh49fg.execute-api.us-east-1.amazonaws.com/dev"
if(process.env.ENV === 'dev') {
  environmentURLSurvey = "https://nshroh49fg.execute-api.us-east-1.amazonaws.com/dev"
} else if(process.env.ENV === 'develop') {
  environmentURLSurvey = "https://pu8du42pz4.execute-api.us-east-1.amazonaws.com/develop"
} else if(process.env.ENV === 'staging') {
  environmentURLSurvey = "https://7qze6sod1c.execute-api.us-east-1.amazonaws.com/staging"
} else if(process.env.ENV === 'prod') {
  environmentURLSurvey = "https://pk58tyr64h.execute-api.us-east-1.amazonaws.com/prod"
}

const userIdPresent = false;
const partitionKeyName = "id";
const partitionKeyType = "S";
const sortKeyName = "manager";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/location";
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

/********************************************
 * HTTP Get Method for Locations by Manager *
 ********************************************/

app.get(path, function(req, res){
  const queryParams = {
    TableName: tableName,
    IndexName: "ManagerIndex",
    KeyConditionExpression: "manager = :manager",
    ExpressionAttributeValues: {
      ":manager": req.query.manager,
    },
  };

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.json({ error: "Could not load items: " + err });
    } else {
      res.json({
        data: data.Items,
        backendEnv: process.env.ENV
      });
    }
  });
});

/*****************************************
 * HTTP Get method for get single location by ID *
 *****************************************/

app.get(path + "/object", function (req, res) {
  let getItemParams = {
    TableName: tableName,
    Key: {"id": req.query.id},
  };

  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ 
        error:" Could not load items: " + err.message,
        id: req.query.id
       });
      
    } else {
      res.json({ body: data.Item, environmentURL: environmentURLSurvey, backendEnv: process.env.ENV})
    }
  });
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post(path, function (req, res) {
  
  if (userIdPresent) {
    req.body["userId"] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  var d = new Date()
  var exprDate = new Date(d.setMonth(d.getMonth()+1))
  req.body["subscription_end_date"] = exprDate.toDateString()
  req.body["menu_link"] = ''
  req.body['active'] = 1
  req.body["sublocations"] = []

  let putItemParams = {
    TableName: tableName,
    Item: req.body,
  };

  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      res.json({ success: "post call succeed!", url: req.url, data: data });
    }
  });
});

/************************************
* HTTP patch to update menus *
*************************************/

app.patch(path + '/menu', function(req, res) {
  if (userIdPresent) {
    req.body["userId"] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }
  
  var params = {
    TableName: tableName,
    Key: {
      "id": req.body.id
    },
    UpdateExpression: "set menus = :M",
    ExpressionAttributeValues: {
      ":M": req.body.menus
    },
    ReturnValues:"UPDATED_NEW"
  }
  dynamodb.update(params, function(err, data) {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body});
    } else {
      res.json({ success: "patch call succeed!", url: req.url, data: data });
    }
  });

});

/************************************
* HTTP patch to update sublocations *
*************************************/

app.patch(path + '/sublocations', function(req, res) {
  if (userIdPresent) {
    req.body["userId"] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }
  var params = {
    TableName: tableName,
    Key: {
      "id": req.body.loc_id
    },
    UpdateExpression: "set sublocations = :sub",
    ExpressionAttributeValues: {
      ":sub": req.body.sublocations
    },
    ReturnValues:"UPDATED_NEW"
  }

  dynamodb.update(params, function(err, data) {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body});
    } else {
      res.json({ success: "patch call succeed!", url: req.url, data: data });
    }
  });
});

/************************************
* HTTP patch to update location info *
*************************************/

app.patch(path + '/info', function(req, res) {
  if (userIdPresent) {
    req.body["userId"] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  var params = {
    TableName: tableName,
    Key: { "id": req.body.id },
    UpdateExpression: "set imageUrl = :IMG, loc_name = :LN, email = :EM, phone = :PH, loc_type = :LT, addrLine1 = :AL1, addrLine2 = :AL2, addrState = :AS, addrCity = :AC, addrZip = :AZ, covidResponseSurvey = :CRS",
    ExpressionAttributeValues: {
      ":IMG": req.body.imageUrl,
      ":LN": req.body.loc_name,
      ":EM": req.body.email,
      ":PH": req.body.phone,
      ":LT": req.body.loc_type,
      ":AL1": req.body.addrLine1,
      ":AL2": req.body.addrLine2,
      ":AC": req.body.addrCity,
      ":AS": req.body.addrState,
      ":AZ": req.body.addrZip,
      ":CRS": req.body.covidResponseSurvey
    },
    ReturnValues: "UPDATED_NEW"
  }

  dynamodb.update(params, function(err, data) {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body});
    } else {
      res.json({ success: "patch call succeed!", url: req.url, data: data });
    }
  });
})

/************************************
* HTTP patch to update active *
*************************************/

app.patch(path + '/active', function(req, res) {
  if (userIdPresent) {
    req.body["userId"] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }
  var params = {
    TableName: tableName,
    Key: {
      "id": req.body.id
    },
    UpdateExpression: "set active = :ac",
    ExpressionAttributeValues: {
      ":ac": 0
    },
    ReturnValues:"UPDATED_NEW"
  }

  dynamodb.update(params, function(err, data) {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body});
    } else {
      res.json({ success: "patch call succeed!", url: req.url, data: data });
    }
  });
});

app.get(path + '/qrTemplate', function(req, res) {
  if (userIdPresent) {
    req.body["userId"] = req.apiGateway.event.requestContext.identity.cognityIdentityId || UNAUTH;
  }
  const tempNum = req.query.templateNumber;
  const qrUrl = req.query.qrUrl;
  const templateUrl = "https://cleanview-location214612-prod.s3.amazonaws.com/public/templates/qrt-0" + tempNum + ".jpeg";
  const url2 = "https://cleanview-location214612-prod.s3.amazonaws.com/public/templates/qrt-02.jpeg"

  const coords = {
    1: {x: 0, y: 0},
    2: {x: 2, y: 2},
    3: {x: 3, y: 3},
    4: {x: 4, y: 4}
  }

  mergeImages([
    {src: templateUrl, x: 0, y: 0},
    {src: url2, x: 0, y: 0}
  ])
    .then(b64 => {
      res.statusCode = 200
      res.json({
        success: "Merged image generated",
        url: req.url,
        data: {
          img: b64
        }
      });
    })
    .catch(err => {
      console.log(err)
      res.statusCode = 500
      res.json({
        error: err,
        url: req.url,
        body: req.body
      });
    });
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
