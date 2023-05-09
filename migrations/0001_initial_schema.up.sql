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
    shelfLife INTERVAL,
    safetyStock INTEGER,
    country VARCHAR(255)
);

CREATE TABLE item_events (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES supply_chain_items_v2(id),
    eventTimestamp TIMESTAMP,
    eventType ENUM('Shipment', 'Receipt', 'Transfer'),
    eventStatus ENUM('Pending', 'Cancelled', 'Completed'),
    location VARCHAR(255),
    custodian VARCHAR(255),
    notes TEXT
);