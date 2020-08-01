const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();
let tableName = process.env.STORAGE_LOCATIONS_NAME;
exports.handler = event => {
  //eslint-disable-line
  console.log(JSON.stringify(event, null, 2));
  event.Records.forEach(record => {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
    let params = updateParams(record)
    console.log(params)
    dynamodb.update(params, function(err, data) {
      if (err) {
        console.log("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
      }
    });
  });
  return Promise.resolve('Successfully processed DynamoDB record');
};
updateParams = (record) => {
  return {
    TableName: tableName,
    Key: {
      "id": record.dynamodb.NewImage.locationId.S
    },
    ExpressionAttributeValues: {
      ":val": 1,
      ":rating": record.dynamodb.NewImage.responseRating.S
    },
    UpdateExpression: buildUpdateExpression(record)
  };
}
buildUpdateExpression = (record) => {
  setExpression = 'SET ';
  if (record.dynamodb.NewImage.sixFeet.S !== 'null') {
    setExpression += 'numSixFeetResponses = numSixFeetResponses + :val, '
  }
  if (record.dynamodb.NewImage.touristDiner.S !== 'null') {
    setExpression += 'numTouristResponses = numTouristResponses + :val, '
  }
  if (record.dynamodb.NewImage.employeeMasks.S !== 'null') {
    setExpression += 'numMasksResponses = numMasksResponses + :val, '
  }
  if (record.dynamodb.NewImage.age.S !== 'null') {
    setExpression += 'numAgeResponses = numAgeResponses + :val, '
  }
  setExpression += 'sumRating = sumRating + :rating, numResponses = numResponses + :val, numRatingResponses = numRatingResponses + :val'
  return setExpression;
}
