const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const Order = require("../src/models/order");
const Item = require("../src/models/item");
const OrdersController = require("../src/controllers/orders");

const MONGODB_LINK =
  "mongodb+srv://ian-project1:zMWYCrPUvgQ4v6cH@cluster0.fcbe0.mongodb.net/test-yammie-restaurant?retryWrites=true&w=majority";
const ORDER_DUMMY_ID = "934d3b395c1ba4f03d0e6773";
const ITEM_DUMMY_ID = "634d3b395c1ba4f03d0e6773";

const createDummyItems = () => {
  return new Item({
    title: "test product",
    price: 10,
    description: "some test",
    _id: ITEM_DUMMY_ID,
  });
};

const createDummyOrder = () => {
  return new Order({
    _id: ORDER_DUMMY_ID,
    customerName: "test name",
    customerAddress: "test address",
    customerPhoneNumber: "000-0000000",
    totalPrice: 40,
    products: [
      {
        product: ITEM_DUMMY_ID,
        quantity: 2,
        note: "note test",
      },
      {
        product: ITEM_DUMMY_ID,
        quantity: 2,
        note: "note test",
      },
    ],
  });
};

const createDummyItemAndOrder = (done) => {
  mongoose
    .connect(MONGODB_LINK)
    .then(() => {
      const item = createDummyItems();
      return item.save();
    })
    .then(() => {
      const order = createDummyOrder();
      return order.save();
    })
    .then(() => done());
};

const clearMongodbData = (done) => {
  Order.deleteMany({})
    .then(() => Item.deleteMany({}))
    .then(() => mongoose.disconnect())
    .then(() => done());
};

describe("Order Controller - Get Order", () => {
  before((done) => {
    createDummyItemAndOrder(done);
  });

  it("should send a response with a valid order id", (done) => {
    const req = {
      params: {
        orderId: ORDER_DUMMY_ID,
      },
    };

    const res = {
      statusCode: 500,
    };
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.order = data.order;
    };

    OrdersController.getOrder(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.order._id.toString()).to.be.equal(ORDER_DUMMY_ID);
        done();
      })
      .catch((err) => console.log(err));
  });

  it("should block a response with a invalid order id", (done) => {
    const req = {
      params: {
        orderId: "134d3b395c1ba4f03d0e6773",
      },
    };

    const res = {
      statusCode: 500,
    };
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };

    OrdersController.getOrder(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(404);
        done();
      })
      .catch((err) => console.log(err));
  });

  it("should send a response with a period params - day", (done) => {
    const req = {
      params: {
        period: "day",
      },
    };

    const res = {
      statusCode: 500,
    };
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };

    OrdersController.getPeriodOrder(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        done();
      })
      .catch((err) => console.log(err));
  });

  after((done) => {
    clearMongodbData(done);
  });
});

describe("Order Controller - Create New Order", () => {
  before((done) => {
    mongoose
      .connect(MONGODB_LINK)
      .then(() => {
        const item = createDummyItems();
        return item.save();
      })
      .then(() => done());
  });

  it("should send a response with a order data body and create new order", (done) => {
    const req = {
      body: {
        customerName: "test",
        customerAddress: "Cool address 22",
        customerPhoneNumber: "054-4444444",
        products: [
          {
            product: ITEM_DUMMY_ID,
            quantity: 2,
            note: "some note",
          },
        ],
      },
    };

    const res = {
      statusCode: 500,
    };
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };

    OrdersController.createNewOrder(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(201);
        done();
      })
      .catch((err) => console.log(err));
  });

  after((done) => {
    clearMongodbData(done);
  });
});

describe("Order Controller - Update Order", () => {
  before((done) => {
    createDummyItemAndOrder(done);
  });

  it("should send a response with a order data body and order id param, and update order", (done) => {
    const testTextUpdate = "order update test - successfully";
    const req = {
      params: { orderId: ORDER_DUMMY_ID },
      body: {
        customerName: testTextUpdate,
        products: [
          {
            product: ITEM_DUMMY_ID,
            quantity: 3,
            note: "some note",
          },
        ],
      },
    };

    const res = {
      statusCode: 500,
    };
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.order = data.order;
    };

    OrdersController.updateOrder(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.order.customerName).to.be.equal(testTextUpdate);
        expect(res.order.totalPrice).to.be.equal(30);
        done();
      })
      .catch((err) => console.log(err));
  });

  after((done) => {
    clearMongodbData(done);
  });
});
