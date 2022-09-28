DROP TABLE IF EXISTS employee_refrigerant CASCADE;

CREATE TABLE employee_refrigerant (
    id SERIAL PRIMARY KEY NOT NULL,
employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
refrigerant_id INTEGER REFERENCES refrigerants(id) ON DELETE CASCADE
);