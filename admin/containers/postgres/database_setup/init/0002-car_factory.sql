-- 
\set DB 'car_factory'
\set TABLE_DIR '/database_setup/databases/car_factory/tables'

-- Connect
\c :DB

-- Schema files (all tables)
\i :TABLE_DIR/make.sql
\i :TABLE_DIR/model.sql
\i :TABLE_DIR/factories.sql
\i :TABLE_DIR/production_batches.sql
\i :TABLE_DIR/production_schedule.sql

-- Data loads (one DO block, sequential)
COPY make FROM '/database_setup/databases/car_factory/data/make.csv' WITH (FORMAT CSV, DELIMITER '|', HEADER MATCH);
COPY model FROM '/database_setup/databases/car_factory/data/model.csv' WITH (FORMAT CSV, DELIMITER '|', HEADER MATCH);
COPY factories FROM '/database_setup/databases/car_factory/data/factories.csv' WITH (FORMAT CSV, DELIMITER '|', HEADER MATCH);
COPY production_batches FROM '/database_setup/databases/car_factory/data/production_batches.csv' WITH (FORMAT CSV, DELIMITER '|', HEADER MATCH);
COPY production_schedule FROM '/database_setup/databases/car_factory/data/production_schedule.csv' WITH (FORMAT CSV, DELIMITER '|', HEADER MATCH);
