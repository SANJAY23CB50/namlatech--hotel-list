export function validateHotelForm(values, imageFile, isEdit) {
  const errors = {};
  const title = (values.title || "").trim();
  const description = (values.description || "").trim();
  const latitude = Number(values.latitude);
  const longitude = Number(values.longitude);
  const price = Number(values.price);

  if (!title) {
    errors.title = "Please enter a hotel name.";
  } else if (title.length < 3) {
    errors.title = "Hotel name should be at least 3 characters.";
  }

  if (!description) {
    errors.description = "Please add a short description.";
  } else if (description.length < 10) {
    errors.description = "Description should be at least 10 characters.";
  }

  if (values.latitude === "" || Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
    errors.latitude = "Enter a valid latitude between -90 and 90.";
  }

  if (values.longitude === "" || Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
    errors.longitude = "Enter a valid longitude between -180 and 180.";
  }

  if (values.price === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than 0.";
  }

  if (!isEdit && !imageFile) {
    errors.image = "Please upload a hotel image.";
  }

  return errors;
}

export function snippet(text, length) {
  if (!text) {
    return "";
  }
  if (text.length <= length) {
    return text;
  }
  return text.slice(0, length).trim() + "...";
}

export function formatPrice(value) {
  const amount = Number(value);
  if (Number.isNaN(amount)) {
    return value;
  }
  return "₹" + amount.toLocaleString("en-IN");
}

export function distanceKm(lat1, lon1, lat2, lon2) {
  const toRad = function (deg) {
    return (deg * Math.PI) / 180;
  };
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 6371 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
