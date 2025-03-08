import csv
import psycopg2
from tqdm import tqdm
import json

conn = psycopg2.connect(
    host='localhost',
    database='nrocinu',
    user='postgres',
    password='postgres',
    port=15432,
)
cur = conn.cursor()

with open('data/prod/users.csv') as f:
    reader = csv.reader(f)
    next(reader, None)
    for row in tqdm(reader):
        cur.execute('INSERT INTO apps_1.users (id, country, language) VALUES (%s, %s, %s)', (
            row[0],
            row[2],
            None if row[1] == 'NULL' else row[1]
        ))

with open('data/prod/items.csv') as f:
    reader = csv.reader(f)
    next(reader, None)
    for row in tqdm(reader):
        cur.execute('INSERT INTO apps_1.items (id, title, attributes) VALUES (%s, %s, %s)', (
            row[0],
            row[1],
            json.dumps({
                'home_team_name': row[5],
                'away_team_name': row[6],
                'leauge': row[7],
                'region': row[8],
                'sport': row[9],
            })
        ))

cur.execute('alter table apps_1.interactions add column bet_id text, add column bet_stake numeric')
with open('data/prod/interactions.csv') as f:
    reader = csv.reader(f)
    next(reader, None)
    batch = []
    for row in tqdm(reader):
        batch.extend([
            row[0],
            row[1],
            row[2],
            row[3],
            row[4],
            row[5]
        ])
        
        if len(batch) >= 60000:
            values = []
            for i in range(len(batch) // 6):
                values.append('(%s, %s, %s, %s, %s, %s)')
            values = ','.join(values)

            query = f'INSERT INTO apps_1.interactions (id, user_id, item_id, bet_id, bet_stake, created_at) VALUES {values} on conflict do nothing'
            cur.execute(query, batch)
            conn.commit()

            batch = []

    if len(batch):
        values = []
        for i in range(len(batch) // 6):
            values.append('(%s, %s, %s, %s, %s, %s)')
        values = ','.join(values)

        query = f'INSERT INTO apps_1.interactions (id, user_id, item_id, bet_id, bet_stake, created_at) VALUES {values} on conflict do nothing'
        cur.execute(query, batch)
        conn.commit()

cur.execute('alter table apps_1.interactions alter column rating set data type numeric')
cur.execute('create index on apps_1.interactions (bet_id)')
cur.execute('''
    update apps_1.interactions AS i
    set rating = (
        select i.bet_stake / (select count(1) from apps_1.interactions i2 where i2.bet_id = i.bet_id)
    )
''')
cur.execute('alter table apps_1.interactions drop column bet_id, drop column bet_stake')
conn.commit()

cur.close()
conn.close()
