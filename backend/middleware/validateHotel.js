function toNumber(value) {
  if (value === undefined || value === null || value === "") {
    return NaN;
  }
  return Number(value);
}

function validateHotel(req, res, next) {
  const errors = {};
  const title = (req.body.title || "").trim();
  const description = (req.body.description || "").trim();
  const latitude = toNumber(req.body.latitude);
  const longitude = toNumber(req.body.longitude);
  const price = toNumber(req.body.price);
  const isUpdate = req.method === "PUT";

  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length < 3 || title.length > 150) {
    errors.title = "Title must be between 3 and 150 characters.";
  }

  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length < 10 || description.length > 2000) {
    errors.description = "Description must be between 10 and 2000 characters.";
  }

  if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
    errors.latitude = "Latitude must be a number between -90 and 90.";
  }

  if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
    errors.longitude = "Longitude must be a number between -180 and 180.";
  }

  if (Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }

  if (!isUpdate && !req.file) {
    errors.image = "Hotel image is required.";
  }

  if (Object.keys(errors).length > 0) {
    if (req.file) {
      const fs = require("fs");
      fs.unlink(req.file.path, function () {});
    }
    return res.status(400).json({ message: "Validation failed.", errors });
  }

  req.hotelData = {
    title: title,
    description: description,
    latitude: latitude,
    longitude: longitude,
    price: price
  };

  next();
}

module.exports = validateHotel;
