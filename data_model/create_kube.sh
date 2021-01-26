#!/bin/bash

USERNAME=cassandra
PASSWORD=cassandra

# install local sqlsh
## port forward to kube
echo open port to kube
echo kubectl port-forward service/cas-cassandra 9042:9042

cqlsh.py -u $USERNAME -p $PASSWORD -f 01_lane_type.cql
cqlsh.py -u $USERNAME -p $PASSWORD -f 02_heat_data_table.cql
cqlsh.py -u $USERNAME -p $PASSWORD -f 03_heat_ids.cql
cqlsh.py -u $USERNAME -p $PASSWORD -f 04_base_data.cql
cqlsh.py -u $USERNAME -p $PASSWORD -f 05_base_data.cql