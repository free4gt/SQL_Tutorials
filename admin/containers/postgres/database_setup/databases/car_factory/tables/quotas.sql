CREATE TABLE quotas (
    quota_id SERIAL PRIMARY KEY,
    dealership_id INT,
    region_id INT,
    model_id INT,
    quota_period DATE,
    full_quantity INT,
    accepted_quantity INT,
    delivered_quantity INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending'
);