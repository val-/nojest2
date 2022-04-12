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

INSERT INTO nj_user(full_name, phone_number, email, email_confirmed, password_hash, avatar) VALUES
  ('A', '1', 'a@test.com', TRUE, '', ''),
  ('B', '2', 'b@test.com', TRUE, '', ''),
  ('C', '3', 'c@test.com', TRUE, '', '');
