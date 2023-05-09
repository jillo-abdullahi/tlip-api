const express = require('express');
const router = express.Router();
const pool = require("./database");

// Create a new supply chain item
router.post("/items", async (req, res) => {
  const { name, color, price } = req.body;
  const result = await pool.query(
    "INSERT INTO supply_chain_items (name, color, price) VALUES ($1, $2, $3) RETURNING *",
    [name, color, price]
  );
  res.status(201).json(result.rows[0]);
});

// Update supply chain item reference data
router.put("/items/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, color, price } = req.body;
  const result = await pool.query(
    "UPDATE supply_chain_items SET name=$1, color=$2, price=$3 WHERE id=$4 RETURNING *",
    [name, color, price, id]
  );
  res.status(200).json(result.rows[0]);
});

// Add new events associated with an item
router.post("/items/:id/events", async (req, res) => {
  const supply_chain_item_id = parseInt(req.params.id);
  const { location, custodian, timestamp } = req.body;
  const result = await pool.query(
    "INSERT INTO item_events (supply_chain_item_id, location, custodian, timestamp) VALUES ($1, $2, $3, $4) RETURNING *",
    [supply_chain_item_id, location, custodian, timestamp]
  );
  res.status(201).json(result.rows[0]);
});

// Query all events of an item
router.get("/items/:id/events", async (req, res) => {
  const supply_chain_item_id = parseInt(req.params.id);
  const result = await pool.query(
    "SELECT * FROM item_events WHERE supply_chain_item_id=$1 ORDER BY timestamp",
    [supply_chain_item_id]
  );
  res.status(200).json(result.rows);
});

// Get the last event of an item
router.get("/items/:id/events/last", async (req, res) => {
  const supply_chain_item_id = parseInt(req.params.id);
  const result = await pool.query(
    "SELECT * FROM item_events WHERE supply_chain_item_id=$1 ORDER BY timestamp DESC LIMIT 1",
    [supply_chain_item_id]
  );
  res.status(200).json(result.rows[0]);
});


module.exports = router;