\c car_factory

COPY cars (car_id, make, model, color, trim, production_cost, retail_cost, production_date, quantity)
FROM '/database_setup/data/cars.csv'
WITH (FORMAT csv, DELIMITER '|', HEADER true);