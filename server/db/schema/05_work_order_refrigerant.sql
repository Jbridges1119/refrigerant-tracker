-- DROP TABLE IF EXISTS work_order_refrigerant CASCADE;

-- CREATE TABLE work_order_refrigerant (
--     id SERIAL PRIMARY KEY NOT NULL,
-- work_order_id INTEGER REFERENCES work_orders(id) ON DELETE CASCADE,
-- refrigerant_id INTEGER REFERENCES refrigerants(id) ON DELETE CASCADE
-- );