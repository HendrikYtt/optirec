import pandas as pd

df = pd.read_csv('data/prod-2023-03-14/interactions.csv', dtype={'item_id': 'string'})

user_ids = df['user_id'].unique()
with open('data/user-ids.txt', 'w') as f:
    f.write(','.join(user_ids))

item_ids = df['item_id'].unique()
with open('data/item-ids.txt', 'w') as f:
    f.write(','.join(item_ids))
