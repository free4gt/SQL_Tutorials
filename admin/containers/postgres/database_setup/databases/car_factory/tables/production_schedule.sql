CREATE TABLE production_schedule (
    schedule_id SERIAL PRIMARY KEY,
    factory_id INT,
    batch_id INT,
    scheduled_date DATE,
    actual_date DATE,
    status VARCHAR(20)
);