# node-openapi

## Examples:

openapi build spec --source=./docs/index.json --dist=./dist/openapi.json

openapi build typescript --source=http://localhost:3011 --dist=./src/rest/api

openapi serve editor --port=3010 --host=http://localhost --source=./dist/openapi.json --basePath=/v1

openapi serve spec --port=3011 --host=http://localhost --source=./dist/openapi.json

## Help:

openapi help

openapi build help
