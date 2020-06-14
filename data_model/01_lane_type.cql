drop TABLE if exists colorado.heatdata;
drop TYPE if exists colorado.lane;

CREATE type colorado.lane ( athleteid varchar, birthdate varchar, 
firstname varchar, lastname varchar, lane varchar, 
entrytime varchar, name varchar,
      code varchar,
      type varchar,
      event varchar,
      place varchar,
      dtime varchar, 
      heat varchar
       );