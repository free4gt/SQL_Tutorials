CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    vin VARCHAR(17),
    dealership_id INT,
    quota_id INT,
    sale_date DATE,
    sale_price DECIMAL(10,2)
);