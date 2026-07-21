"""Script to create the PostgreSQL database for FreelanceHub."""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

try:
    conn = psycopg2.connect(
        host='localhost',
        port=5432,
        user='postgres',
        password='kanha',
        dbname='postgres'
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    cur.execute("SELECT 1 FROM pg_database WHERE datname='freelancehub'")
    if not cur.fetchone():
        cur.execute('CREATE DATABASE freelancehub')
        print('Database freelancehub created successfully!')
    else:
        print('Database freelancehub already exists.')
    conn.close()
    print('Done.')
except Exception as e:
    print(f'Error: {e}')
