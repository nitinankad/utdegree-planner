from os import getenv
from flask import abort, jsonify
from psycopg2 import OperationalError
from psycopg2.pool import SimpleConnectionPool
import json

# Set these environment variables to your DB
CONNECTION_NAME = getenv('POSTGRES_INSTANCE')
DB_USER = getenv('POSTGRES_USER')
DB_PASSWORD = getenv('POSTGRES_PASSWORD')
DB_NAME = getenv('POSTGRES_DATABASE')

pg_config = {
  'user': DB_USER,
  'password': DB_PASSWORD,
  'dbname': DB_NAME
}

pg_pool = None

def __connect(host):
    global pg_pool
    pg_config['host'] = host
    pg_pool = SimpleConnectionPool(1, 1, **pg_config)

def build_response(data):
    response = jsonify(data)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Headers', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST')
    return response

# Function to execute
def get_degree_plan(request):
    global pg_pool

    if not pg_pool:
        try:
            __connect(f'/cloudsql/{CONNECTION_NAME}')
        except OperationalError:
            __connect('localhost')


    data = request.get_json(silent=True)
    if not data:
        return build_response({"Error": "Invalid request"})

    desired_degree_plan = data.get("degreeName")

    with pg_pool.getconn() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT data FROM degree_plans WHERE name='%s'" % desired_degree_plan)
        results = cursor.fetchone()
        pg_pool.putconn(conn)

        result = str(results[0])

        result = json.loads(result)
        response = build_response(result)

        return response
    