const Item = require("../models/item");

exports.addNewProduct = (req, res, next) => {
  const { title, price, description } = req.body;
  const item = new Item({
    title: title,
    price: price,
    description: description,
  });

  item
    .save()
    .then((result) => {
      res.status(201).json({
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); //move to the error handle
    });
};
