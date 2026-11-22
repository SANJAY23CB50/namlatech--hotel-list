const fs = require("fs");
const path = require("path");
require("dotenv").config();
const pool = require("./db");
const hotelsController = require("./controllers/hotelsController");
const validateHotel = require("./middleware/validateHotel");

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.data = data;
      return this;
    }
  };
  return res;
}

async function run() {
  console.log("=================================================");
  console.log("   AUTOMATED VERIFICATION OF ALL REQUIREMENTS    ");
  console.log("=================================================\n");

  let createdId = null;
  let firstImagePath = null;
  const uploadsDir = path.join(__dirname, "uploads");

  try {
    // -----------------------------------------------------------------
    // TEST 1: Validation middleware with invalid inputs
    // -----------------------------------------------------------------
    console.log("▶ TEST 1: validateHotel Middleware (Invalid Form Inputs)");
    const invalidReq = {
      method: "POST",
      body: {
        title: "No", // too short (<3)
        description: "short", // too short (<10)
        latitude: "199", // out of range
        longitude: "-250", // out of range
        price: "-100" // non-positive
      },
      file: null // missing file
    };
    const res1 = mockRes();
    let nextCalled = false;
    validateHotel(invalidReq, res1, () => { nextCalled = true; });

    console.log("  Status Code:", res1.statusCode, "(Expected: 400)");
    console.log("  Validation Errors Caught:", Object.keys(res1.data.errors));
    if (
      res1.statusCode === 400 &&
      res1.data.errors.title &&
      res1.data.errors.description &&
      res1.data.errors.latitude &&
      res1.data.errors.longitude &&
      res1.data.errors.price &&
      res1.data.errors.image
    ) {
      console.log("  ✓ PASS: Full validation strictly enforced for all required fields!\n");
    } else {
      throw new Error("Validation middleware failed to enforce all constraints.");
    }

    // -----------------------------------------------------------------
    // TEST 2: POST /api/hotels (Hotel Creation with Image Upload & Native SQL)
    // -----------------------------------------------------------------
    console.log("▶ TEST 2: createHotel (POST API with Native SQL & File Storage)");
    const sampleFileName = `test-${Date.now()}-sample.jpg`;
    const sampleFilePath = path.join(uploadsDir, sampleFileName);
    fs.writeFileSync(sampleFilePath, Buffer.from("test image content 123"));

    const validReq = {
      method: "POST",
      body: {
        title: "Automation Suites Residency",
        description: "Luxurious test suites with serene gardens, conference halls, and spa services.",
        latitude: "18.9500000",
        longitude: "72.8200000",
        price: "6800.00"
      },
      file: {
        filename: sampleFileName,
        path: sampleFilePath
      }
    };
    const resVal = mockRes();
    let validNext = false;
    validateHotel(validReq, resVal, () => { validNext = true; });

    if (!validNext) {
      throw new Error("Valid data was rejected by validateHotel: " + JSON.stringify(resVal.data));
    }

    const res2 = mockRes();
    await hotelsController.createHotel(validReq, res2);
    console.log("  Status Code:", res2.statusCode, "(Expected: 201)");
    console.log("  Created Hotel ID:", res2.data.hotel.id);
    console.log("  Hotel Title in DB:", res2.data.hotel.title);
    console.log("  Stored Image Path:", res2.data.hotel.image_path);

    createdId = res2.data.hotel.id;
    firstImagePath = res2.data.hotel.image_path;

    if (res2.statusCode === 201 && createdId && fs.existsSync(sampleFilePath)) {
      console.log("  ✓ PASS: Hotel record inserted via Native SQL and image stored on local server!\n");
    } else {
      throw new Error("createHotel failed.");
    }

    // -----------------------------------------------------------------
    // TEST 3: GET /api/hotels with Title + Price Filters Combined
    // -----------------------------------------------------------------
    console.log("▶ TEST 3: getHotels (Search by Title and Price Filters Combined)");
    // Title filter
    const reqSearch = { query: { title: "Automation", limit: "10", offset: "0" } };
    const resSearch = mockRes();
    await hotelsController.getHotels(reqSearch, resSearch);
    console.log(`  Filtered by title='Automation': Found ${resSearch.data.hotels.length} hotel(s)`);

    // Price filter (6000 to 7500)
    const reqPrice = { query: { minPrice: "6000", maxPrice: "7500", limit: "10", offset: "0" } };
    const resPrice = mockRes();
    await hotelsController.getHotels(reqPrice, resPrice);
    console.log(`  Filtered by price [6000, 7500]: Found ${resPrice.data.hotels.length} hotel(s)`);

    // Combined Title + Price Filters
    const reqCombo = { query: { title: "Automation", minPrice: "6000", maxPrice: "7500", limit: "10", offset: "0" } };
    const resCombo = mockRes();
    await hotelsController.getHotels(reqCombo, resCombo);
    console.log(`  Combined Filter (Title + MinPrice + MaxPrice): Found ${resCombo.data.hotels.length} hotel(s)`);

    if (resCombo.data.hotels.length === 1 && resCombo.data.hotels[0].id === createdId) {
      console.log("  ✓ PASS: Combined search by title and price range returned exact match via Native SQL!\n");
    } else {
      throw new Error("Combined filter test failed.");
    }

    // -----------------------------------------------------------------
    // TEST 4: Pagination API (limit and offset)
    // -----------------------------------------------------------------
    console.log("▶ TEST 4: getHotels (Pagination Support: offset & limit)");
    const reqPage1 = { query: { limit: "3", offset: "0" } };
    const resPage1 = mockRes();
    await hotelsController.getHotels(reqPage1, resPage1);

    const reqPage2 = { query: { limit: "3", offset: "3" } };
    const resPage2 = mockRes();
    await hotelsController.getHotels(reqPage2, resPage2);

    console.log(`  Total hotels in DB: ${resPage1.data.total}`);
    console.log(`  Page 1 (limit=3, offset=0): ${resPage1.data.hotels.length} hotels`);
    console.log(`  Page 2 (limit=3, offset=3): ${resPage2.data.hotels.length} hotels`);

    const p1Ids = resPage1.data.hotels.map(h => h.id);
    const p2Ids = resPage2.data.hotels.map(h => h.id);
    const overlap = p1Ids.filter(id => p2Ids.includes(id));

    if (resPage1.data.hotels.length === 3 && resPage2.data.hotels.length > 0 && overlap.length === 0) {
      console.log("  ✓ PASS: Native SQL pagination accurately slices records with zero overlap!\n");
    } else {
      throw new Error("Pagination test failed.");
    }

    // -----------------------------------------------------------------
    // TEST 5: GET /api/hotels/:id (Detail API)
    // -----------------------------------------------------------------
    console.log("▶ TEST 5: getHotelById (Detail API)");
    const reqDetail = { params: { id: createdId } };
    const resDetail = mockRes();
    await hotelsController.getHotelById(reqDetail, resDetail);

    console.log("  Status Code:", resDetail.statusCode, "(Expected: 200)");
    console.log("  Retrieved Title:", resDetail.data.hotel.title);
    console.log("  Latitude:", resDetail.data.hotel.latitude);
    console.log("  Longitude:", resDetail.data.hotel.longitude);

    if (resDetail.statusCode === 200 && resDetail.data.hotel.title === "Automation Suites Residency") {
      console.log("  ✓ PASS: Hotel record retrieved successfully by ID!\n");
    } else {
      throw new Error("getHotelById failed.");
    }

    // -----------------------------------------------------------------
    // TEST 6: PUT /api/hotels/:id (Update without image replacement)
    // -----------------------------------------------------------------
    console.log("▶ TEST 6: updateHotel (Edit API without image replacement)");
    const updateReq1 = {
      method: "PUT",
      params: { id: createdId },
      body: {
        title: "Renovated Automation Suites",
        description: "Renovated luxury suites with world-class amenities and dining options.",
        latitude: "18.9600000",
        longitude: "72.8300000",
        price: "7900.00"
      },
      file: null
    };
    validateHotel(updateReq1, mockRes(), () => {});
    const resUpdate1 = mockRes();
    await hotelsController.updateHotel(updateReq1, resUpdate1);

    console.log("  Status Code:", resUpdate1.statusCode, "(Expected: 200)");
    console.log("  Updated Title:", resUpdate1.data.hotel.title);
    console.log("  Updated Price:", resUpdate1.data.hotel.price);
    console.log("  Image Retained:", resUpdate1.data.hotel.image_path);

    if (
      resUpdate1.statusCode === 200 &&
      resUpdate1.data.hotel.title === "Renovated Automation Suites" &&
      resUpdate1.data.hotel.price === "7900.00" &&
      resUpdate1.data.hotel.image_path === firstImagePath
    ) {
      console.log("  ✓ PASS: Existing hotel details updated and image retained!\n");
    } else {
      throw new Error("updateHotel (without image) failed.");
    }

    // -----------------------------------------------------------------
    // TEST 7: PUT /api/hotels/:id (Update WITH new image replacement)
    // -----------------------------------------------------------------
    console.log("▶ TEST 7: updateHotel (Edit API with Image Replacement)");
    const newFileName = `test-${Date.now()}-replacement.jpg`;
    const newFilePath = path.join(uploadsDir, newFileName);
    fs.writeFileSync(newFilePath, Buffer.from("new replacement image content"));

    const updateReq2 = {
      method: "PUT",
      params: { id: createdId },
      body: {
        title: "Final Premium Automation Suites",
        description: "Premium suites featuring an updated photo and top-tier hospitality.",
        latitude: "18.9700000",
        longitude: "72.8400000",
        price: "8500.00"
      },
      file: {
        filename: newFileName,
        path: newFilePath
      }
    };
    validateHotel(updateReq2, mockRes(), () => {});
    const resUpdate2 = mockRes();
    await hotelsController.updateHotel(updateReq2, resUpdate2);

    console.log("  Status Code:", resUpdate2.statusCode, "(Expected: 200)");
    console.log("  New Image Path in DB:", resUpdate2.data.hotel.image_path);

    // Give fs.unlink a moment
    await new Promise(r => setTimeout(r, 100));
    const oldExists = fs.existsSync(sampleFilePath);
    const newExists = fs.existsSync(newFilePath);
    console.log("  Old Image File deleted from server disk?", !oldExists);
    console.log("  New Image File exists on server disk?", newExists);

    if (resUpdate2.statusCode === 200 && !oldExists && newExists) {
      console.log("  ✓ PASS: New image saved and old image unlinked from server disk!\n");
    } else {
      throw new Error("updateHotel (with image replacement) failed.");
    }

    // -----------------------------------------------------------------
    // TEST 8: DELETE /api/hotels/:id
    // -----------------------------------------------------------------
    console.log("▶ TEST 8: deleteHotel (Delete API & Image Cleanup)");
    const deleteReq = { params: { id: createdId } };
    const resDelete = mockRes();
    await hotelsController.deleteHotel(deleteReq, resDelete);

    console.log("  Status Code:", resDelete.statusCode, "(Expected: 200)");
    console.log("  Delete Message:", resDelete.data.message);

    await new Promise(r => setTimeout(r, 100));
    const finalImageExists = fs.existsSync(newFilePath);
    console.log("  Image File cleaned up from disk?", !finalImageExists);

    // Verify record is gone from DB
    const checkReq = { params: { id: createdId } };
    const resCheck = mockRes();
    await hotelsController.getHotelById(checkReq, resCheck);
    console.log("  Fetch deleted hotel status:", resCheck.statusCode, "(Expected: 404)");

    if (resDelete.statusCode === 200 && !finalImageExists && resCheck.statusCode === 404) {
      console.log("  ✓ PASS: Hotel record deleted from PostgreSQL and image removed from server!\n");
    } else {
      throw new Error("deleteHotel failed.");
    }

    console.log("=================================================");
    console.log("   ALL ASSIGNMENT REQUIREMENTS VERIFIED 100%!    ");
    console.log("=================================================");
    process.exit(0);

  } catch (err) {
    console.error("\n❌ TEST FAILED:", err);
    process.exit(1);
  }
}

run();
