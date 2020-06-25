/*
  05_base_data.cql
*/

INSERT INTO colorado.heatdata (heatid, lastid, competition, event, heat, creation_date, lanes)
           VALUES (4e2c1f5c-4121-4a8c-9ebc-521b5a8b1e1a, 4e2c1f5c-4121-4a8c-9ebc-521b5a8b1e1a, 'Schwimmen', '0' , '0' ,toTimeStamp(now())
                      , [{
      athleteid: '0',
      birthdate: '2013-01-01',
      firstname: 'Welcome',
      lastname: ''
    }]
           );