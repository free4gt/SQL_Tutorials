\c car_factory

COPY cars (make, model, price_usd, color) 
FROM '/database_setup/data/cars.csv'  -- Capital D
WITH (FORMAT csv, DELIMITER '|', HEADER true);