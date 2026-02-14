CREATE TABLE regions (
    region_id SERIAL PRIMARY KEY,
    region_name VARCHAR(30) NOT NULL UNIQUE,
    regional_manager VARCHAR(100),
    target_growth DECIMAL(5,2) DEFAULT 1.05
);