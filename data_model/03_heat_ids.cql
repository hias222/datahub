/*
    03_heat_ids.cql
*/

drop TABLE if exists colorado.heatids;

CREATE TABLE colorado.heatids
( wkid int, creation_date timestamp, heatID uuid,
PRIMARY KEY (wkid, creation_date) ) 
WITH CLUSTERING ORDER BY (creation_date DESC)
;

