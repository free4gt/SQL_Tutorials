CREATE TABLE production_schedule (
    schedule_id SERIAL PRIMARY KEY,
    factory_id INT REFERENCES factories(factory_id),
    batch_id INT REFERENCES production_batches(batch_id),
    scheduled_date DATE,
    actual_date DATE,
    status VARCHAR(20)
);