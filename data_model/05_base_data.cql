/*
  05_base_data.cql
*/

INSERT INTO colorado.heatdata (heatid, lastid, creation_date, lanes)
           VALUES (4e2c1f5c-4121-4a8c-9ebc-521b5a8b1e1a, 4e2c1f5c-4121-4a8c-9ebc-521b5a8b1e1a, toTimeStamp(now())
                      , [{
      athleteid: '123',
      birthdate: '2013-01-01',
      firstname: '',
      lastname: ''
    }]
           );