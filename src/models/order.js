const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customerName: { type: String, required: true },
    customerAddress: { type: String, required: true },
    customerPhoneNumber: { type: String, required: true },
    products: [
      {
        product: { type: Schema.Types.ObjectId, required: true, ref: "Item" },
        quantity: { type: Number, required: true },
        note: { type: String },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
