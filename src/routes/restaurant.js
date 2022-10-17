const express = require("express");

const restaurantController = require("../controllers/restaurant");

const router = express.Router();

//POST   /restaurant/add-product
router.post("/add-product", restaurantController.addNewProduct);

module.exports = router;
