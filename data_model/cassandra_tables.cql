drop keyspace if exists colorado;

CREATE KEYSPACE colorado
  WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };
use colorado;

drop TYPE if exists json.lane;
drop TABLE if exists json.heat;

CREATE type colorado.lane ( id int, item text );
CREATE TABLE colorado.heat ( id int  PRIMARY KEY, name text, lanedata frozen<list<lane>> );
CREATE TABLE colorado.heat2 ( id int  PRIMARY KEY, name text, lanedata map<text, text> );

map<text, text>

DROP INDEX IF EXISTS laneid_idx;
CREATE INDEX laneid_idx ON colorado.heat (full( lanedata ));
CREATE index laneid_idx
ON colorado.heat
WITH COLUMNS name;
ON colorado.heat ( FULL(lanedata.id) );

INSERT INTO colorado.heat (id, name, lanedata) 
VALUES (123, 'Greenville Hardware',
 [{ id: 5544, time: 'hello'},
  { id: 6666, item: 'wire'}]) ;


INSERT INTO colorado.heatdata (event_heat_id, creation_date, lane_data)
           VALUES ('11', toTimeStamp(toDate(now())),
           [{
      athleteid: 123,
      birthdate: '2013-01-01',
      firstname: 'Henri',
      lastname: 'Wittl'
    }]
    );

INSERT INTO colorado.heat (id, name, lanedata) 
VALUES (123, 'Greenville Hardware',
 { id: 5544, item: 'tape'});


drop materialized view if exists reminders_by_user;
drop materialized view if exists reminders_by_next_notification;
drop table if exists reminders;

create table reminders (
    reminder_id timeuuid,
    user_id uuid,
    name text,
    description text,
    last_notification timestamp,
    next_notification timestamp,
    completed boolean,
    schedule list<text>,
    primary key (reminder_id)
);


create materialized view reminders_by_user as
  select * from reminders
  where reminder_id is not null and user_id is not null
  primary key (user_id, reminder_id);

create materialized view reminders_by_next_notification as
  select * from reminders
  where reminder_id is not null and next_notification is not null
  primary key (next_notification, reminder_id)
  with clustering order by ( next_notification asc );
  
insert into reminders (reminder_id, user_id, next_notification, last_notification, description) values(now(), 01234567-0123-0123-0123-0123456789ab, dateOf(now()), '2000-01-01', 'empty fridge');
insert into reminders (reminder_id, user_id, next_notification, last_notification, description) values(now(), 01234567-0123-0123-0123-0123456789ab, dateOf(now()), '2000-01-01', 'run');
insert into reminders (reminder_id, user_id, next_notification, last_notification, description) values(now(), 01234567-0123-0123-0123-0123456789ab, dateOf(now()), '2000-01-01', 'swim');
 