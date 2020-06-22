#!/bin/bash

export SSL_VERSION=TLSv1_2
export SSL_VALIDATE=false

cosmoshost=dhcassandra.cassandra.cosmos.azure.com
cosmosusername=dhcassandra
cosmospassword=sEjSQpTy9lJ3dT3Ba8mlWTXLOg6cHzgSP5pkjjqMlHU2eZAbCFvnllIbXFo4yBr13P9nbDHjV0OXtOjAIZo1RQ==

cqlsh.py ${cosmoshost} 10350 -u ${cosmosusername} -p ${cosmospassword} --ssl -f 01_lane_type.cql
cqlsh.py ${cosmoshost} 10350 -u ${cosmosusername} -p ${cosmospassword} --ssl -f 02_heat_data_table.cql
cqlsh.py ${cosmoshost} 10350 -u ${cosmosusername} -p ${cosmospassword} --ssl -f 03_heat_ids.cql
cqlsh.py ${cosmoshost} 10350 -u ${cosmosusername} -p ${cosmospassword} --ssl -f 04_base_data.cql
cqlsh.py ${cosmoshost} 10350 -u ${cosmosusername} -p ${cosmospassword} --ssl -f 05_base_data.cql