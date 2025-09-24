const express = require("express");
const router = express.Router();
const db = require("../dbms-project-be/models");

// GET all events
router.get("/", async (req, res) => {
  try {
    const events = await db.Event.findAll({
      include: [{ model: db.User, attributes: ["user_id", "username", "email"] }]
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id, {
      include: [{ model: db.User, attributes: ["user_id", "username", "email"] }]
    });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new event
router.post("/", async (req, res) => {
  try {
    const newEvent = await db.Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE event by ID
router.put("/:id", async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    await event.update(req.body);
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE event by ID
router.delete("/:id", async (req, res) => {
  try {
    const event = await db.Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    await event.destroy();
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
