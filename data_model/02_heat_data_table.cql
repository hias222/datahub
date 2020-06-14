drop TABLE if exists colorado.heatdata;

CREATE TABLE colorado.heatdata
( event_heat_ID int, creation_date timestamp, lanes frozen<list<lane>>, type varchar, relaycount varchar,
event varchar, heat varchar, gender varchar, round varchar, swimstyle varchar,
distance varchar, name varchar, competition varchar,
PRIMARY KEY (event_heat_ID, creation_date) ) 
WITH CLUSTERING ORDER BY (creation_date DESC);

