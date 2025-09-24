const express = require("express");
const router = express.Router();
const db = require("../dbms-project-be/models");

// GET all venues
router.get("/", async (req, res) => {
  try {
    const venues = await db.Venue.findAll();
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one venue by ID
router.get("/:id", async (req, res) => {
  try {
    const venue = await db.Venue.findByPk(req.params.id);
    if (!venue) return res.status(404).json({ error: "Venue not found" });
    res.json(venue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new venue
router.post("/", async (req, res) => {
  try {
    const newVenue = await db.Venue.create(req.body);
    res.status(201).json(newVenue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE venue by ID
router.put("/:id", async (req, res) => {
  try {
    const venue = await db.Venue.findByPk(req.params.id);
    if (!venue) return res.status(404).json({ error: "Venue not found" });

    await venue.update(req.body);
    res.json(venue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE venue by ID
router.delete("/:id", async (req, res) => {
  try {
    const venue = await db.Venue.findByPk(req.params.id);
    if (!venue) return res.status(404).json({ error: "Venue not found" });

    await venue.destroy();
    res.json({ message: "Venue deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
