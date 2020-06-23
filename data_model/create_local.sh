#!/bin/bash

cqlsh.py -f 01_lane_type.cql
cqlsh.py -f 02_heat_data_table.cql
cqlsh.py -f 03_heat_ids.cql
cqlsh.py -f 04_base_data.cql
cqlsh.py -f 05_base_data.cql