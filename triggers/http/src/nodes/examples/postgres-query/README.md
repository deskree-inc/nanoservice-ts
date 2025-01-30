# POSTGRES NODE

This nanoservice execute queries with POSTGRES. The workflow used to execute this nanoservice is:

1. films.json

## Configuration

```json
"get-films": {
    "inputs": {
        "host": "localhost",
        "port": 5432,
        "database": "dvdrental",
        "user": "postgres",
        "password": "example",
        "query": "SELECT * FROM \"film\" ORDER BY \"title\" LIMIT 50"
    }
}
```

## Deploy the Default Database

To start testing this example, you need a Postgres Database available. Or just create it using our docker-compose.yml example.

```sh
cd infra/development
docker compose up -d
```

The database is created including tables and records.