const express = require("express");
const { upload } = require("../middleware/upload");
const validateHotel = require("../middleware/validateHotel");
const hotelsController = require("../controllers/hotelsController");

const router = express.Router();

router.get("/", hotelsController.getHotels);
router.get("/:id", hotelsController.getHotelById);
router.post("/", upload.single("image"), validateHotel, hotelsController.createHotel);
router.put("/:id", upload.single("image"), validateHotel, hotelsController.updateHotel);
router.delete("/:id", hotelsController.deleteHotel);

module.exports = router;
