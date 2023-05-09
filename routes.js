const express = require("express");
const router = express.Router();
const pool = require("./database");
const { v4: uuidv4 } = require("uuid");

// Create a new supply chain item
router.post("/items", async (req, res) => {
  const {
    name,
    color,
    price,
    description,
    createdOn,
    city,
    postalCode,
    address,
    quantity,
    shelfLife,
    safetyStock,
    country,
  } = req.body;
  const client = await pool.connect();
  const skuCode = uuidv4(); // Generate a new UUID for the item

  try {
    const result = await client.query(
      `
      INSERT INTO supply_chain_items (name, color, price, skuCode, description, createdOn, city, postalCode, address, quantity, shelfLife, safetyStock, country)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `,
      [
        name,
        color,
        price,
        skuCode,
        description,
        createdOn,
        city,
        postalCode,
        address,
        quantity,
        shelfLife,
        safetyStock,
        country,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "An error occurred while creating item" });
  } finally {
    client.release();
  }
});

// Update supply chain item reference data
router.put("/items/:item_id", async (req, res) => {
  const item_id = parseInt(req.params.item_id, 10);
  const {
    name,
    color,
    price,
    skuCode,
    description,
    createdOn,
    city,
    postalCode,
    address,
    quantity,
    shelfLife,
    safetyStock,
    country,
  } = req.body;
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      UPDATE supply_chain_items
      SET name = $1, color = $2, price = $3, skuCode = $4, description = $5, createdOn = $6, city = $7, postalCode = $8, address = $9, quantity = $10, shelfLife = $11, safetyStock = $12, country = $13
      WHERE id = $14
      RETURNING *;
    `,
      [
        name,
        color,
        price,
        skuCode,
        description,
        createdOn,
        city,
        postalCode,
        address,
        quantity,
        shelfLife,
        safetyStock,
        country,
        item_id,
      ]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the item" });
  } finally {
    client.release();
  }
});

// add new events associated with an item
router.post("/items/:item_id/events", async (req, res) => {
  const item_id = parseInt(req.params.item_id, 10);
  const { eventTimestamp, eventType, eventStatus, location, custodian, notes } =
    req.body;
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      INSERT INTO item_events (item_id, eventTimestamp, eventType, eventStatus, location, custodian, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `,
      [
        item_id,
        eventTimestamp,
        eventType,
        eventStatus,
        location,
        custodian,
        notes,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res
      .status(500)
      .json({ error, message: "An error occurred while creating the event" });
  } finally {
    client.release();
  }
});

// Query all events of an item
router.get("/items/:id/events", async (req, res) => {
  const supply_chain_item_id = parseInt(req.params.id);
  const result = await pool.query(
    "SELECT * FROM item_events WHERE item_id=$1 ORDER BY eventTimestamp",
    [supply_chain_item_id]
  );
  res.status(200).json(result.rows);
});

// Get the last event of an item
router.get("/items/:id/events/last", async (req, res) => {
  const supply_chain_item_id = parseInt(req.params.id);
  const result = await pool.query(
    "SELECT * FROM item_events WHERE item_id=$1 ORDER BY eventTimestamp DESC LIMIT 1",
    [supply_chain_item_id]
  );
  res.status(200).json(result.rows[0]);
});

module.exports = router;
