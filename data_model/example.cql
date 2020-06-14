
CREATE TABLE scores (
  user TEXT,
  game TEXT,
  year INT,
  month INT,
  day INT,
  score INT,
  PRIMARY KEY (user, game, year, month, day)
)

CREATE MATERIALIZED VIEW alltimehigh AS
       SELECT user FROM scores
       WHERE game IS NOT NULL AND score IS NOT NULL AND user IS NOT NULL AND year IS NOT NULL AND month IS NOT NULL AND day IS NOT NULL
       PRIMARY KEY (game, score, user, year, month, day)
       WITH CLUSTERING ORDER BY (score desc)


use json;

CREATE type json.sale ( id int, item text, amount int );

CREATE TABLE user_videos ( userid uuid, added_date timestamp, videoid uuid, name text, preview_image_location text, PRIMARY KEY (userid, added_date, videoid) ) WITH CLUSTERING ORDER BY (added_date DESC, videoid ASC);

CREATE TABLE json.customers ( id int  PRIMARY KEY, name text, balance int, sales list> );

INSERT INTO json.customers (id, name, balance, sales) 
VALUES (123, 'Greenville Hardware', 700,
 [{ id: 5544, item : 'tape', amount : 100},
  { id: 5545, item : 'wire', amount : 200}]) ;

  select * from customers;

 id  | balance | name                | sales
-----+---------+---------------------+--------------------------------------------------------------------------------
 123 |     700 | Greenville Hardware | [{id: 5544, item: 'tape', amount: 100}, {id: 5545, item: 'wire', amount: 200}]

 select id, toJson(sales) from customers;

 id  | system.tojson(sales)
-----+--------------------------------------------------------------------------------------------
 123 | [{"id": 5544, "item": "tape", "amount": 100}, {"id": 5545, "item": "wire", "amount": 200}]