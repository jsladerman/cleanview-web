import numpy as np
import random
import uuid
import boto3
import json
from datetime import datetime

ddb = boto3.resource('dynamodb')
table = ddb.Table('survey_responses-dev')
age = ["0-17", "18-25", "26-35", "36-45", "46-55", "56-65", "66+"]
employee_masks = [0, 1]
menu_link = "https://www.google.com"
response_rating = np.arange(0, 5.5, 0.5)
six_feet = [0, 1]
tourist_diner = [0, 1]
total_id = ["a7e5f4-b03-53a5-fa65-4c1c0ae86f99strl99strl6e69386b-4045-40ab-ba19-ca37a1c5a11f",
            "a7e5f4-b03-53a5-fa65-4c1c0ae86f99strl99strl0625a5fb-0178-4f0e-85f0-0cb65313cf2e",
            "a7e5f4-b03-53a5-fa65-4c1c0ae86f99strl99strlb11c2d51-41ce-4baf-8dca-960a0cf524ce",
            "a7e5f4-b03-53a5-fa65-4c1c0ae86f99strl99strl472415d-8ef4-dbd7-3e8c-525a7c32b83",
            "a7e5f4-b03-53a5-fa65-4c1c0ae86f99strl99strl8165148e-dceb-4401-b3d7-d1d9cfcb2760"]

columns = ['age', 'employee-masks', 'menu-link', 'response-rating', 'six-feet', 'total-id', 'tourist-diner'];

jstr = '['

for i in range(0, 100):
    jstr = jstr + json.dumps({
        'id': str(uuid.uuid4()),
        'age': str(random.choice(age)),
        'employee-masks': str(random.choice(employee_masks)),
        'menu-link': menu_link,
        'response-rating': str(random.choice(response_rating)),
        'six-feet': str(random.choice(six_feet)),
        'tourist-diner': str(random.choice(tourist_diner)),
        'total-id': random.choice(total_id),
        'timestamp': str(datetime.now())
    }) + ','

jstr = jstr[:-1] + ']'

print(jstr)
