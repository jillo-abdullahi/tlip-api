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
    city,
    postalCode,
    address,
    quantity,
    shelfLife,
    safetyStock,
    country,
  } = req.body;
  const client = await pool.connect();
  const skuCode = uuidv4();

  try {
    const result = await pool.query(
      "INSERT INTO supply_chain_items (name, color, price, skuCode, description, createdOn, city, postalCode, address, quantity, shelfLife, safetyStock, country) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7, $8, $9, $10, $11, $12) RETURNING *",
      [
        name,
        color,
        price,
        skuCode,
        description,
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
    description,
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
      SET name = $1, color = $2, price = $3, description = $4, city = $5, postalCode = $6, address = $7, quantity = $8, shelfLife = $9, safetyStock = $10, country = $11
      WHERE id = $12
      RETURNING *;
    `,
      [
        name,
        color,
        price,
        description,
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
      .json({ error, message: "An error occurred while updating the item" });
  } finally {
    client.release();
  }
});

// add new events associated with an item
router.post("/items/:item_id/events", async (req, res) => {
  const item_id = parseInt(req.params.item_id, 10);
  const { eventType, eventStatus, location, custodian, notes } = req.body;
  const client = await pool.connect();

  try {
    // Check if the item exists
    const itemResult = await pool.query(
      "SELECT * FROM supply_chain_items WHERE id = $1",
      [item_id]
    );

    if (itemResult.rowCount === 0) {
      // If the item does not exist, return a 404 status code
      return res.status(404).json({ message: "Item not found" });
    }

    const result = await client.query(
      `
      INSERT INTO item_events (item_id, eventTimestamp, eventType, eventStatus, location, custodian, notes)
      VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5, $6)
      RETURNING *;
    `,
      [item_id, eventType, eventStatus, location, custodian, notes]
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

// Query all items
router.get("/items", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM supply_chain_items ORDER BY createdon DESC"
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ error: "No items found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the items" });
  }
});

// Query all events of an item
router.get("/items/:id/events", async (req, res) => {
  try {
    const supply_chain_item_id = parseInt(req.params.id);
    const result = await pool.query(
      "SELECT * FROM item_events WHERE item_id=$1 ORDER BY eventTimestamp",
      [supply_chain_item_id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res.status(404).json({ error: "No events found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while retrieving item events" });
  }
});

// Query an item by id
router.get("/items/:id", async (req, res) => {
  try {
    const supply_chain_item_id = parseInt(req.params.id);
    const result = await pool.query(
      "SELECT * FROM supply_chain_items WHERE id=$1",
      [supply_chain_item_id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the item" });
  }
});

// Delete an item
router.delete("/items/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // start transaction since we have to delete from two tables
    await pool.query("BEGIN");

    // Delete associated events from the item_events table
    await pool.query("DELETE FROM item_events WHERE item_id = $1", [id]);

    // Delete the supply chain item from the supply_chain_items table
    const deleteResult = await pool.query(
      "DELETE FROM supply_chain_items WHERE id = $1",
      [id]
    );

    // Commit the transaction
    await pool.query("COMMIT");

    if (deleteResult.rowCount === 0) {
      res.status(404).json({ message: "Item not found" });
    } else {
      res
        .status(200)
        .json({ message: "Item and associated events deleted successfully" });
    }
  } catch (error) {
    // Rollback the transaction in case of error
    await pool.query("ROLLBACK");
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the item" });
  }
});

// Get the last event of an item
router.get("/items/:id/events/last", async (req, res) => {
  try {
    const supply_chain_item_id = parseInt(req.params.id);
    const result = await pool.query(
      "SELECT * FROM item_events WHERE item_id=$1 ORDER BY eventTimestamp DESC LIMIT 1",
      [supply_chain_item_id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "No events found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while retrieving last item event" });
  }
});

module.exports = router;
