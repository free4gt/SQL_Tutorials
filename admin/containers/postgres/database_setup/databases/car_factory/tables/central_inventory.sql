CREATE TABLE central_inventory (
    inventory_id SERIAL PRIMARY KEY,
    vin VARCHAR(17),
    model_id INT,
    color_id INT,
    trim_id INT,
    location VARCHAR(50),
    arrived_date DATE,
    status VARCHAR(20) DEFAULT 'available',
    quota_id INT
);