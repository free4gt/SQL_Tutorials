CREATE TABLE trims (
    trim_id SERIAL PRIMARY KEY,
    trim_name VARCHAR(50) NOT NULL,  -- 'LE', 'XLE', 'Limited', 'TRD Pro'
    base_price DECIMAL(10,2),
    description TEXT
);