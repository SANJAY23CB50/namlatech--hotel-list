const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const hotelRoutes = require("./routes/hotels");

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/hotels", hotelRoutes);

app.use(function (err, _req, res, _next) {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "Validation failed.",
      errors: { image: "Image must be 5MB or smaller." }
    });
  }
  if (err && err.message) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: { image: err.message }
    });
  }
  res.status(500).json({ message: "Something went wrong." });
});

const pool = require("./db");

app.listen(PORT, async function () {
  console.log("Server running on http://localhost:" + PORT);
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        latitude NUMERIC(10, 7) NOT NULL,
        longitude NUMERIC(10, 7) NOT NULL,
        price NUMERIC(12, 2) NOT NULL,
        image_path VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("PostgreSQL: hotels table verified.");
  } catch (err) {
    console.warn("PostgreSQL table init note:", err.message);
  }
});
