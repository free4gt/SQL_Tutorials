CREATE TABLE make (
    make_id SERIAL PRIMARY KEY,
    make_name VARCHAR(20) NOT NULL,
    start_date DATE,
    end_date DATE,
    notes VARCHAR(100)
);