const { model, Schema } = require("mongoose");
const moment = require("moment");

let dateTime = new Date();

const ProductSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  kilograms: {
    type: Number,
  },

  liters: {
    type: Number,
  },

  price: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: String,
    default: () => moment(dateTime).format("YYYY-MM-DD"),
  },

  updatedAt: {
    type: String,
    default: () => moment(dateTime).format("YYYY-MM-DD"),
  },

});

module.exports = model("Product", ProductSchema);
