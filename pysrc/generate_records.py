import numpy as np
import random
import uuid
import boto3
import json
import datetime

ddb = boto3.resource('dynamodb')
table = ddb.Table('responses-dev')
age = ["0-17", "18-25", "26-35", "36-45", "46-55", "56-65", "66+"]
employee_masks = [0, 1]
menu_link = "https://www.google.com"
response_rating = np.arange(0, 5.5, 0.5)
six_feet = [0, 1]
tourist_diner = [0, 1]
# location_ids = ["108f633-888e-b70c-e3ee-d7648626ad7f",
#                 "13d85cd-fe84-02a-4e73-0ab343677bd",
#                 "7b2d147-4f20-f068-831d-ebfb363154",
#                 "8ca0f72-0e2c-7ec4-6672-cbbd506b206"]
# subloc_ids = {
#     "108f633-888e-b70c-e3ee-d7648626ad7f": [
#         "6e69386b-4045-40ab-ba19-ca37a1c5a11f",
#         "a1576d2f-993e-4c38-b900-91492598dda2",
#         "427ca1a3-b3b5-4533-be57-3ceffde3c86b"
#     ],
#     "13d85cd-fe84-02a-4e73-0ab343677bd": [
#         "d44ea40f-d4ae-4e58-ae13-e79ea417799c",
#         "6b5e7e8a-8fe6-4735-83b0-380a26d7d8ad",
#         "7bd8cb6a-3b62-45b5-9c16-34de964871f1"
#     ],
#     "7b2d147-4f20-f068-831d-ebfb363154": [
#         "3e7fbe55-20bb-45c6-bcec-bb9dd599bad2",
#         "20167d9e-cb37-4b70-a6b4-4f9177b4b69d",
#         "413d3551-8ec6-4f79-bfe6-5a2feb30c6fb"
#     ],
#     "8ca0f72-0e2c-7ec4-6672-cbbd506b206": [
#         "79ae895f-1cb7-4f06-b141-e4852df34907",
#         "3a339e2f-699b-47cb-b9a7-fb6908c841c7",
#         "0a621bce-441a-4776-97f7-7d427e2ec763"
#     ]
# }

location_ids = ["bc737ed-dfe2-bca-05b-be4e60082206"]
subloc_ids = {
    "bc737ed-dfe2-bca-05b-be4e60082206": ["5c36540-e23-d120-0ac6-d37bf74b2", "1a7c8964-9e62-46f9-bf7d-7bded89b2a3e", "4e634d-6f41-01c5-4a6-678026bd88d8", "b7ad705-804a-ab4e-eb1-b45c36ab3b78"]
}

# jstr = '['

# for i in range(0, 100):
#     jstr = jstr + json.dumps({
#         'id': str(uuid.uuid4()),
#         'age': str(random.choice(age)),
#         'employee-masks': str(random.choice(employee_masks)),
#         'menu-link': menu_link,
#         'response-rating': str(random.choice(response_rating)),
#         'six-feet': str(random.choice(six_feet)),
#         'tourist-diner': str(random.choice(tourist_diner)),
#         'total-id': random.choice(total_id),
#         'timestamp': str(datetime.now())
#     }) + ','

# jstr = jstr[:-1] + ']'

# print(jstr)

days = list(range(1, 31))
hours = list(range(0, 24))
minutes = list(range(0, 60))

for i in range(0, 100):
    restid = random.choice(location_ids)
    timestamp = datetime.datetime(2020, 7, random.choice(days), random.choice(hours), random.choice(minutes), random.choice(minutes)).strftime("%a %b %d %Y %X")
    table.put_item(
        Item={
            'id': str(uuid.uuid4()),
            'age': str(random.choice(age)),
            'employeeMasks': str(random.choice(employee_masks)),
            'menuLink': menu_link,
            'responseRating': str(random.choice(response_rating)),
            'sixFeet': str(random.choice(six_feet)),
            'touristDiner': str(random.choice(tourist_diner)),
            'locationId': restid,
            'sublocId': random.choice(subloc_ids[restid]),
            'weekday': timestamp[0:3],
            'timestamp': timestamp[4:]
        }
    )
