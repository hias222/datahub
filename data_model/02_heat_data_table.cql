drop TABLE if exists colorado.heatdata;

CREATE TABLE colorado.heatdata
( heatID uuid, creation_date timestamp, lanes frozen<list<lane>>, type varchar, relaycount varchar,
event varchar, heat varchar, gender varchar, round varchar, swimstyle varchar,
distance varchar, name varchar, competition varchar,
PRIMARY KEY (heatID) ) 
-- WITH CLUSTERING ORDER BY (creation_date DESC)
;

