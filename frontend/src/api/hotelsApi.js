const API = "/api/hotels";

function toQuery(params) {
  const search = new URLSearchParams();
  Object.keys(params).forEach(function (key) {
    if (params[key] !== "" && params[key] !== null && params[key] !== undefined) {
      search.set(key, params[key]);
    }
  });
  const text = search.toString();
  return text ? "?" + text : "";
}

async function readError(response) {
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    return { message: "Request failed." };
  }
}

export async function fetchHotels(params) {
  const response = await fetch(API + toQuery(params));
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

export async function fetchHotel(id) {
  const response = await fetch(API + "/" + id);
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

export async function createHotel(formData) {
  const response = await fetch(API, {
    method: "POST",
    body: formData
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

export async function updateHotel(id, formData) {
  const response = await fetch(API + "/" + id, {
    method: "PUT",
    body: formData
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

export async function deleteHotel(id) {
  const response = await fetch(API + "/" + id, { method: "DELETE" });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
}

export { readError };
