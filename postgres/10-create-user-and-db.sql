-- file: 10-create-user-and-db.sql
CREATE DATABASE persons;
CREATE ROLE program WITH PASSWORD 'test';
GRANT ALL PRIVILEGES ON DATABASE persons TO program;
ALTER ROLE program WITH LOGIN;

CREATE TABLE personsdata
(
    name varchar(150) NOT NULL,
    age integer,
    address varchar(300),
    work varchar(300),
    id SERIAL PRIMARY KEY
)