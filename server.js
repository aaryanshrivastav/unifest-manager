require("dotenv").config();
const express = require("express");
const db = require("./dbms-project-be/models");

const app = express();
app.use(express.json());


const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const venueRoutes = require("./routes/venues");


app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/venues", venueRoutes);


app.get("/", (req, res) => {
  res.send("🚀 Oracle + Express API is running!");
});

// Connect DB + start server
const PORT = process.env.PORT || 5000;

db.sequelize.authenticate()
  .then(() => {
    console.log("✅ Connected to Oracle DB");
    return db.sequelize.sync(); 
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch(err => console.error("❌ DB connection failed:", err));
