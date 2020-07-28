/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require("aws-sdk");
const { uuid } = require('uuidv4')
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
var bodyParser = require("body-parser");
var express = require("express");

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "locations";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV;
}

// HARD CODED: url endpoints
let environmentURL = "https://ha6zsn1cv7.execute-api.us-east-1.amazonaws.com/dev"
if(process.env.ENV === 'dev') {
  environmentURL = "https://ha6zsn1cv7.execute-api.us-east-1.amazonaws.com/dev"
}



const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "id";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/manageLocation";
const UNAUTH = "UNAUTH";
const hashKeyPath = "/:" + partitionKeyName;
const sortKeyPath = hasSortKey ? "/:" + sortKeyName : "";
// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch (type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
};

/********************************
 * HTTP Get method for list objects *
 ********************************/
app.get(path, function(req, res){
  const queryParams = {
    TableName: tableName,
    KeyConditionExpression: "manager = :manager",
    IndexName: "manager",
    ExpressionAttributeValues: {
      ":manager": req.query.manager,
    }
  };

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.json({ error: "Could not load items: " + err });
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + "/object", function (req, res) {
  let getItemParams = {
    TableName: tableName,
    Key: {id: req.query.id},
    ProjectionExpression: 'id, menu_link, sublocations',
  };

  dynamodb.get(getItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ 
        error: req.query.id + " Could not load items: " + err.message
       });
      
    } else {
      res.json({ body: data.Item, environmentURL: environmentURL})
    }
  });
});

/************************************
 * HTTP put method for insert object *
 *************************************/

app.put(path, function (req, res) {
  if (userIdPresent) {
    req.body["userId"] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }


  let putItemParams = {
    TableName: tableName,
    Item: req.body,
  };
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      res.json({ success: "put call succeed!", url: req.url, data: data });
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
  req.body["sublocations"] = [{
    name: 'Main',
    id: uuid(),
    color: '000000'
  }]

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

/**************************************
 * HTTP remove method to delete object *
 ***************************************/

app.delete(path + "/object" + hashKeyPath + sortKeyPath, function (req, res) {
  var params = {};
  if (userIdPresent && req.apiGateway) {
    params[partitionKeyName] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  } else {
    params[partitionKeyName] = req.params[partitionKeyName];
    try {
      params[partitionKeyName] = convertUrlType(
        req.params[partitionKeyName],
        partitionKeyType
      );
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: "Wrong column type " + err });
    }
  }
  if (hasSortKey) {
    try {
      params[sortKeyName] = convertUrlType(
        req.params[sortKeyName],
        sortKeyType
      );
    } catch (err) {
      res.statusCode = 500;
      res.json({ error: "Wrong column type " + err });
    }
  }

  let removeItemParams = {
    TableName: tableName,
    Key: params,
  };
  dynamodb.delete(removeItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url });
    } else {
      res.json({ url: req.url, data: data });
    }
  });
});
app.listen(3000, function () {
  console.log("App started");
});

// Patch Request 

app.patch(path, function(req, res) {
  if (userIdPresent) {
    req.body["userId"] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }
  var params = {
    TableName: tableName,
    Key: {
      "id": req.body.loc_id
    },
    UpdateExpression: "set menu_link = :url",
    ExpressionAttributeValues: {
      ":url": req.body.menu_link
    },
    ReturnValues:"UPDATED_NEW"
  }
  dynamodb.update(params, function(err, data) {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body, url: req.body.menu_link});
    } else {
      res.json({ success: "patch call succeed!", url: req.url, data: data });
    }
  });

});

// Patch request for sublocations

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
      res.json({ error: err, url: req.url, body: req.body, url: req.body.menu_link});
    } else {
      res.json({ success: "patch call succeed!", url: req.url, data: data });
    }
  });
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
