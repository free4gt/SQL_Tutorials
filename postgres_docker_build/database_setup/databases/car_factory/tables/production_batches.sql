CREATE TABLE production_batches (
    batch_id INT PRIMARY KEY,
    model_id INT REFERENCES model(model_id),
    color_id INT REFERENCES color(color_id),
    trim_id INT REFERENCES trim(trim_id),
    planned_date DATE,
    planned_quantity INT,
    status VARCHAR(20) DEFAULT 'planned'
);