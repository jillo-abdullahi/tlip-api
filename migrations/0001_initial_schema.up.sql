CREATE TABLE supply_chain_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    color VARCHAR(255),
    price DECIMAL(10, 2)
);

CREATE TABLE item_events (
    id SERIAL PRIMARY KEY,
    supply_chain_item_id INTEGER REFERENCES supply_chain_items (id),
    location VARCHAR(255),
    custodian VARCHAR(255),
    timestamp TIMESTAMP
);