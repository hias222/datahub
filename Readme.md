# datahub

## cassandra

docker run --name cassandra -p 7000:7000 -p 9042:9042 -d cassandra  

--network localhost
-Dcassandra.config=/path/to/cassandra.yaml  
docker exec -it cassandra bash

## cqlsh

docker run -it --rm cassandra cqlsh cassandra

from mac
brew install cassandra
cqlsh --> connects to localhost docker

## start

### dev

npm run start:dev

## app

npm install -g express-generator-typescript

npx express-generator-typescript "project name (default is express-gen-ts)"
OR
npx express-generator-typescript --with-auth

    Run the server in development mode: npm run start:dev.
    Run all unit-tests: npm test.
    Run a single unit-test: npm test -- --testFile="name of test file" (i.e. --testFile=Users).
    Check for linting errors: npm run lint.
    Build the project for production: npm run build.
    Run the production build: npm start.
    Run production build with a different env file npm start -- --env="name of env file" (default is production).

Debugging

During development, express-generator-typescript uses nodemon to restart the server when changes are detected. If you want to enable debugging for node, you'll need to modify the nodemon configurations. This is located under nodemonConfig: in package.json for the server and ./spec/nodemon.json for unit-testing. For the exec property, replace ts-node with node --inspect -r ts-node/register.

### errors

#### check tsc craetion

npx ts-node -r tsconfig-paths/register ./src --env=production

## Docker

```bash
# start local docker

npm run build

docker build -t datahub .

docker login
docker tag datahub hias222/datahub:0.1.0
docker push hias222/datahub:0.1.0

DEST_MQTT_HOST
docker run -p 8080:8080 datahub
docker images
```
