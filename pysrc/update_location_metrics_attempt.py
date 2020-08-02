import boto3

ddb = boto3.resource('dynamodb')
table = ddb.Table('locations-develop')

response = ddb.update_item(
    TableName='locations-develop'
    Key={
        'id': {
            'S': 'dc30344-fc00-5b0d-a43-e12e8fe1bbd'
        }
    },
    AttributeUpdates={
        
    }
)