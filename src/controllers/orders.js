const Order = require("../models/order");
const Item = require("../models/item");

const DAY = 1000 * 60 * 60 * 24;
const WEEK = 7;
const MONTH = 30;
const TIME_TO_UPDATE = 1000 * 60 * 15;

const requestError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

const dateFilterPicker = (period) => {
  let searchTimeRange;
  if (period === "day") {
    searchTimeRange = new Date(Date.now() - DAY);
  } else if (period === "week") {
    searchTimeRange = new Date(Date.now() - DAY * WEEK);
  } else if (period === "month") {
    searchTimeRange = new Date(Date.now() - DAY * MONTH);
  } else {
    requestError(422, "Invalid params.");
  }
  searchTimeRange = searchTimeRange.toISOString().split("T")[0]; //date format YYYY/MM/DD

  return searchTimeRange;
};

const totalPriceCalculation = async (products) => {
  let totalPrice = 0;

  const prices = products.map(async (element) => {
    const item = await Item.findOne({ _id: element.product }).exec();
    if (!item) {
      requestError(404, "Product not found.");
    }
    return item.price * element.quantity;
  });
  const pricesArray = await Promise.all(prices);
  totalPrice = pricesArray.reduce((prev, next) => prev + next, 0);

  return totalPrice;
};

exports.createNewOrder = async (req, res, next) => {
  const products = req.body.products;
  const customerName = req.body.customerName;
  const customerAddress = req.body.customerAddress;
  const customerPhoneNumber = req.body.customerPhoneNumber;
  const totalPrice = await totalPriceCalculation(products);

  if (totalPrice < 0) {
    requestError(422, "Product price invalid");
  }

  const order = new Order({
    customerName: customerName,
    customerAddress: customerAddress,
    customerPhoneNumber: customerPhoneNumber,
    products: products,
    totalPrice: totalPrice,
  });

  await order
    .save()
    .then((result) => {
      res.status(201).json({
        order: result,
      });
    })
    .catch((err) => {
      next(err);
    });
  return res;
};

exports.getOrder = (req, res, next) => {
  const orderId = req.params.orderId;
  return Order.findById(orderId)
    .then((result) => {
      if (!result) {
        requestError(404, "Order not found.");
      }
      return res.status(200).json({ order: result });
    })
    .catch((err) => {
      next(err);
      return res.status(404);
    });
};

exports.getPeriodOrder = (req, res, next) => {
  const period = req.params.period.toString();
  const currentDate = new Date(Date.now() + DAY).toISOString().split("T")[0]; //date format YYYY/MM/DD
  const searchTimeRange = dateFilterPicker(period);

  return Order.find({
    createdAt: {
      $gte: searchTimeRange,
      $lt: currentDate,
    },
  })
    .then((result) => {
      return res.status(200).json({ orders: result });
    })
    .catch((err) => {
      next(err);
      return err;
    });
};

exports.updateOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  await Order.findById(orderId)
    .then(async (order) => {
      if (!order) {
        requestError(404, "Could not find order.");
      }
      const orderCreatedDate = new Date(order.createdAt).getTime(); //order created date to milliseconds
      const currentDate = new Date(Date.now()).getTime(); //current date to milliseconds
      if (currentDate - orderCreatedDate <= TIME_TO_UPDATE) {
        order.customerName = req.body.customerName || order.customerName;
        order.customerAddress =
          req.body.customerAddress || order.customerAddress;
        order.customerPhoneNumber =
          req.body.customerPhoneNumber || order.customerPhoneNumber;
        if (req.body.products) {
          order.products = req.body.products || order.products;
          order.totalPrice = await totalPriceCalculation(req.body.products);
        }
        return order.save();
      } else {
        requestError(422, "The order cannot be update.");
        return res.statusCode(422);
      }
    })
    .then((result) => {
      res.status(200).json({ order: result });
    })
    .catch((err) => {
      next(err);
    });
};
