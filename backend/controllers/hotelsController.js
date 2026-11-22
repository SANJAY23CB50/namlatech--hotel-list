const fs = require("fs");
const path = require("path");
const pool = require("../db");
const { uploadDir } = require("../middleware/upload");

function publicImagePath(filename) {
  return "/uploads/" + filename;
}

function removeImageFile(imagePath) {
  if (!imagePath) {
    return;
  }
  const filename = path.basename(imagePath);
  const fullPath = path.join(uploadDir, filename);
  fs.unlink(fullPath, function () {});
}

async function createHotel(req, res) {
  try {
    const { title, description, latitude, longitude, price } = req.hotelData;
    const imagePath = publicImagePath(req.file.filename);

    const result = await pool.query(
      `INSERT INTO hotels (title, description, latitude, longitude, price, image_path)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, latitude, longitude, price, imagePath]
    );

    res.status(201).json({
      message: "Hotel created successfully.",
      hotel: result.rows[0]
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, function () {});
    }
    res.status(500).json({ message: "Could not create hotel." });
  }
}

async function getHotels(req, res) {
  try {
    const title = (req.query.title || "").trim();
    const minPrice = req.query.minPrice !== undefined && req.query.minPrice !== "" ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice !== undefined && req.query.maxPrice !== "" ? Number(req.query.maxPrice) : null;
    const offset = Number.isInteger(Number(req.query.offset)) ? Math.max(0, Number(req.query.offset)) : 0;
    const limit = Number.isInteger(Number(req.query.limit)) ? Math.min(50, Math.max(1, Number(req.query.limit))) : 6;

    const where = [];
    const values = [];

    if (title) {
      values.push("%" + title + "%");
      where.push("title ILIKE $" + values.length);
    }

    if (minPrice !== null && !Number.isNaN(minPrice)) {
      values.push(minPrice);
      where.push("price >= $" + values.length);
    }

    if (maxPrice !== null && !Number.isNaN(maxPrice)) {
      values.push(maxPrice);
      where.push("price <= $" + values.length);
    }

    const whereSql = where.length ? " WHERE " + where.join(" AND ") : "";

    const countResult = await pool.query("SELECT COUNT(*) AS total FROM hotels" + whereSql, values);
    const total = Number(countResult.rows[0].total);

    values.push(limit);
    values.push(offset);

    const listResult = await pool.query(
      "SELECT * FROM hotels" + whereSql + " ORDER BY id DESC LIMIT $" + (values.length - 1) + " OFFSET $" + values.length,
      values
    );

    res.json({
      hotels: listResult.rows,
      total: total,
      offset: offset,
      limit: limit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch hotels. Check the PostgreSQL connection." });
  }
}

async function getHotelById(req, res) {
  try {
    const result = await pool.query("SELECT * FROM hotels WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Hotel not found." });
    }
    res.json({ hotel: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Could not fetch hotel." });
  }
}

async function updateHotel(req, res) {
  try {
    const existing = await pool.query("SELECT * FROM hotels WHERE id = $1", [req.params.id]);
    if (existing.rows.length === 0) {
      if (req.file) {
        fs.unlink(req.file.path, function () {});
      }
      return res.status(404).json({ message: "Hotel not found." });
    }

    const current = existing.rows[0];
    const { title, description, latitude, longitude, price } = req.hotelData;
    let imagePath = current.image_path;

    if (req.file) {
      imagePath = publicImagePath(req.file.filename);
      removeImageFile(current.image_path);
    }

    const result = await pool.query(
      `UPDATE hotels
       SET title = $1, description = $2, latitude = $3, longitude = $4, price = $5, image_path = $6
       WHERE id = $7
       RETURNING *`,
      [title, description, latitude, longitude, price, imagePath, req.params.id]
    );

    res.json({
      message: "Hotel updated successfully.",
      hotel: result.rows[0]
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, function () {});
    }
    res.status(500).json({ message: "Could not update hotel." });
  }
}

async function deleteHotel(req, res) {
  try {
    const existing = await pool.query("SELECT * FROM hotels WHERE id = $1", [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Hotel not found." });
    }

    await pool.query("DELETE FROM hotels WHERE id = $1", [req.params.id]);
    removeImageFile(existing.rows[0].image_path);

    res.json({ message: "Hotel deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete hotel." });
  }
}

module.exports = {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel
};
