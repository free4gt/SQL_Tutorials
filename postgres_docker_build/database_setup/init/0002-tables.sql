\c car_factory

-- Dynamically include all .sql files from tables/ folder (alphabetical order)
\i /database_setup/tables/car.sql

COPY cars (make, model, price_usd, color) 
FROM '/database_setup/data/cars.csv'  -- Capital D
WITH (FORMAT csv, DELIMITER '|', HEADER true);