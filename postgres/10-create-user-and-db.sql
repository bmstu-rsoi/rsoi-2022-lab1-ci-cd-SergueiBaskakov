-- file: 10-create-user-and-db.sql
CREATE DATABASE persons;
CREATE ROLE program WITH PASSWORD 'test';
GRANT ALL PRIVILEGES ON DATABASE persons TO program;
ALTER ROLE program WITH LOGIN;

CREATE TABLE IF NOT EXISTS public.personsdata
(
    name character varying(150) COLLATE pg_catalog."default" NOT NULL,
    age integer,
    address character varying(300) COLLATE pg_catalog."default",
    work character varying(300) COLLATE pg_catalog."default",
    id integer NOT NULL DEFAULT nextval('personsdata_id_seq'::regclass),
    CONSTRAINT testdata_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.personsdata
    OWNER to program;