CREATE TABLE dealership_inventory (
    inventory_id SERIAL PRIMARY KEY,
    vin VARCHAR(17) UNIQUE,
    model_id INT,
    color_id INT,
    trim_id INT,
    quota_id INT,
    received_date DATE,
    status VARCHAR(20) DEFAULT 'available'
);