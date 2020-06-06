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