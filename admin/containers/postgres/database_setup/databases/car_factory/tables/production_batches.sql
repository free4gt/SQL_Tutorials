CREATE TABLE production_batches (
    batch_id INT PRIMARY KEY,
    model_id INT,
    color_id INT,
    trim_id INT,
    planned_date DATE,
    planned_quantity INT,
    status VARCHAR(20) DEFAULT 'planned'
);