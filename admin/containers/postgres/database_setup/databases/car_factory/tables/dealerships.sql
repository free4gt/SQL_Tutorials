CREATE TABLE dealerships (
    dealership_id SERIAL PRIMARY KEY,
    dealership_name VARCHAR(100),
    location VARCHAR(50),
    region_id INT
);