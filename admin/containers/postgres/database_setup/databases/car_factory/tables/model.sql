CREATE TABLE model (
    model_id SERIAL PRIMARY KEY,
    make_id INT,
    model_name VARCHAR(50) NOT NULL,
    base_cost DECIMAL(10,2),
    intro_date DATE
);