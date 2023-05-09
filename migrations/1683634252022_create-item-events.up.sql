CREATE TABLE supply_chain_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    color VARCHAR(255),
    price NUMERIC,
    skuCode UUID UNIQUE,
    description TEXT,
    createdOn TIMESTAMP,
    city VARCHAR(255),
    postalCode VARCHAR(20),
    address TEXT,
    quantity INTEGER,
    shelfLife INTEGER,
    safetyStock INTEGER,
    country VARCHAR(255)
);

CREATE TYPE event_type_enum AS ENUM ('Shipment', 'Receipt', 'Transfer');
CREATE TYPE event_status_enum AS ENUM ('Pending', 'Cancelled', 'Completed');

CREATE TABLE item_events (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES supply_chain_items(id),
    eventTimestamp TIMESTAMP,
    eventType event_type_enum NOT NULL,
    eventStatus event_status_enum NOT NULL,
    location VARCHAR(255),
    custodian VARCHAR(255),
    notes TEXT
);