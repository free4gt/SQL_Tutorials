CREATE TABLE finished_vehicles (
    vin VARCHAR(17) PRIMARY KEY,
    model_id INT,
    batch_id INT,
    color_id INT,
    trim_id INT,
    production_date DATE,
    factory_id INT,
    cost DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'produced'
);