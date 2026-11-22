const pool = require("./db");
require("dotenv").config();

const dummyHotels = [
  {
    title: "The Grand Palace Hotel",
    description: "Experience 5-star luxury in the heart of Mumbai with panoramic sea views, award-winning fine dining restaurants, infinity swimming pool, and round-the-clock concierge services.",
    latitude: 18.9219841,
    longitude: 72.8331835,
    price: 8500.00,
    image_path: "/uploads/hotel-grand-palace.jpg"
  },
  {
    title: "Azure Waves Ocean Resort",
    description: "Beachfront sanctuary in South Goa with direct private access to pristine white sands, open-air beach shacks, holistic Ayurvedic spa, and sunset cruise arrangements.",
    latitude: 15.2993265,
    longitude: 73.9878235,
    price: 6200.00,
    image_path: "/uploads/hotel-ocean-resort.jpg"
  },
  {
    title: "Jaipur Royal Heritage Haveli",
    description: "Authentic Rajasthani architecture restored to regal elegance. Features hand-painted frescoes, private jharokhas, traditional folk evenings, and rooftop candlelight dining overlooking Nahargarh.",
    latitude: 26.9239361,
    longitude: 75.8267443,
    price: 5400.00,
    image_path: "/uploads/hotel-heritage-haveli.jpg"
  },
  {
    title: "Alpine Mist Mountain Retreat",
    description: "Serene Himalayan hideaway nestled amidst pine forests and snow-capped peaks in Manali. Enjoy heated cottages, wood-burning fireplaces, private hiking trails, and artisanal mountain cuisine.",
    latitude: 32.2431872,
    longitude: 77.1891761,
    price: 4800.00,
    image_path: "/uploads/hotel-mountain-retreat.jpg"
  },
  {
    title: "Lakeview Serenity Villas",
    description: "Romantic waterfront villa retreat on Lake Pichola in Udaipur. Features private plunge pools, royal heritage boat transfers, bespoke dining on floating decks, and sunset terraces.",
    latitude: 24.5854450,
    longitude: 73.6826622,
    price: 9200.00,
    image_path: "/uploads/hotel-lakeside-villa.jpg"
  },
  {
    title: "Urban Skyline Boutique Stay",
    description: "Contemporary design meets urban convenience in Bengaluru's tech corridor. High-speed fiber WiFi, ergonomic workspaces, rooftop cocktail lounge, and seamless metro access.",
    latitude: 12.9715987,
    longitude: 77.5945627,
    price: 3600.00,
    image_path: "/uploads/hotel-urban-boutique.jpg"
  },
  {
    title: "Kerala Backwaters Palm Grove",
    description: "Tranquil eco-luxury resort along Kumarakom backwaters with traditional Kerala tharavadu architecture, private houseboats, organic spice gardens, and rejuvenating yoga pavilions.",
    latitude: 9.6175024,
    longitude: 76.4300958,
    price: 5100.00,
    image_path: "/uploads/hotel-palm-grove.jpg"
  },
  {
    title: "Royal Orchid Executive Suites",
    description: "Upscale business and leisure suites in Delhi NCR featuring spacious suites, modular conference facilities, state-of-the-art gym, all-day multi-cuisine buffet, and airport shuttle services.",
    latitude: 28.5355161,
    longitude: 77.3910265,
    price: 4200.00,
    image_path: "/uploads/hotel-royal-orchid.jpg"
  }
];

async function seed() {
  try {
    console.log("Checking hotels table...");
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

    const countRes = await pool.query("SELECT COUNT(*) AS total FROM hotels");
    if (Number(countRes.rows[0].total) > 0) {
      console.log(`Database already has ${countRes.rows[0].total} hotels.`);
      process.exit(0);
    }

    console.log("Seeding sample hotels with native SQL queries...");
    for (const h of dummyHotels) {
      await pool.query(
        `INSERT INTO hotels (title, description, latitude, longitude, price, image_path)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [h.title, h.description, h.latitude, h.longitude, h.price, h.image_path]
      );
      console.log(`✓ Inserted: ${h.title}`);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
