-- INIT NOJEST APP TABLES

CREATE TABLE nj_session (
    sid varchar NOT NULL COLLATE "default",
    sess json NOT NULL,
    expire timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE nj_session ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON nj_session(expire);

CREATE TYPE nj_ject_status AS ENUM (
    'ACTIVE',
    'INACTIVE'
);

CREATE TYPE nj_version_status AS ENUM (
    'ACTIVE',
    'INACTIVE'
);

CREATE TYPE nj_task_status AS ENUM (
    'OPENED',
    'ASSIGNED',
    'RESOLVED',
    'REOPENED',
    'CANCELLED',
    'DONE'
);

CREATE TABLE nj_user(
    id SERIAL PRIMARY KEY,
    full_name varchar(255),
    phone_number varchar(30),
    email varchar(255) NOT NULL UNIQUE,
    email_confirmed boolean,
    email_confirm_token varchar(64),
    password_hash varchar(64) NOT NULL,
    avatar text
);

CREATE TABLE nj_ject(
    id SERIAL PRIMARY KEY,
    code varchar(64) NOT NULL UNIQUE,
    title varchar(255),
    description text,
    status nj_ject_status
);

CREATE TABLE nj_document(
    id SERIAL PRIMARY KEY,
    ject_id integer REFERENCES nj_ject(id),
    document_author_id integer REFERENCES nj_user(id),
    url text NOT NULL UNIQUE
);

CREATE TABLE nj_member(
    id SERIAL PRIMARY KEY,
    ject_id integer REFERENCES nj_ject(id),
    user_id integer REFERENCES nj_user(id)
);

CREATE TABLE nj_role(
    id SERIAL PRIMARY KEY,
    name varchar(255)
);

CREATE TABLE nj_member_role(
    id SERIAL PRIMARY KEY,
    member_id integer REFERENCES nj_member(id),
    role_id integer REFERENCES nj_role(id)
);

CREATE TABLE nj_version(
    id SERIAL PRIMARY KEY,
    ject_id integer REFERENCES nj_ject(id),
    title varchar(255),
    description text,
    status nj_version_status
);

CREATE TABLE nj_task(
    id SERIAL PRIMARY KEY,
    ject_id integer REFERENCES nj_ject(id),
    task_author_id integer REFERENCES nj_user(id),
    contractor_id integer REFERENCES nj_user(id),
    parent_id integer REFERENCES nj_task(id),
    target_version_id integer REFERENCES nj_version(id)
);

CREATE TABLE nj_task_message(
    id SERIAL PRIMARY KEY,
    task_id integer REFERENCES nj_task(id),
    date_time timestamp,
    author_id integer REFERENCES nj_user(id),
    letter text
);

CREATE TABLE nj_task_history(
    id SERIAL PRIMARY KEY,
    task_id integer REFERENCES nj_task(id),
    date_time timestamp,
    status nj_task_status
);

