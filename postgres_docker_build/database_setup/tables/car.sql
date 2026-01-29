CREATE TABLE cars (
    car_id INT PRIMARY KEY,
    make VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(30),
    trim VARCHAR(50),
    production_cost DECIMAL(10,2),
    retail_cost DECIMAL(10,2),
    production_date DATE,
    quantity INT
);