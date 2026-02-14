CREATE TABLE colors (
    color_id SERIAL PRIMARY KEY,
    color_name VARCHAR(30) NOT NULL UNIQUE,  -- 'Radiant Red', 'Midnight Black'
    color_code CHAR(7)  -- Hex code for reports: '#FF0000'
);