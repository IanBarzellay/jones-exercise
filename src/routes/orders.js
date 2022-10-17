const express = require("express");

const ordersController = require("../controllers/orders");

const router = express.Router();

//POST   /orders
router.post("/", ordersController.createNewOrder);

//GET   /orders/:orderId
router.get("/:orderId", ordersController.getOrder);

//GET /orders/period/:period    period = {day, week, month}
router.get("/period/:period", ordersController.getPeriodOrder);

//PATCH   /orders/:orderId
router.patch("/:orderId", ordersController.updateOrder);

module.exports = router;
