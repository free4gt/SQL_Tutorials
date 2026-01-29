-- Simple car table for tutorials
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    price_usd DECIMAL(10,2) CHECK (price_usd > 0),
    color VARCHAR(30)
);