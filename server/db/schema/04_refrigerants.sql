DROP TABLE IF EXISTS refrigerants CASCADE;

CREATE TABLE refrigerants (
  id SERIAL PRIMARY KEY NOT NULL,
  type VARCHAR(255) NOT NULL,
  current_bottle_used DECIMAL(5,2) DEFAULT 0.00,
  bottle_count INT DEFAULT 0
);
