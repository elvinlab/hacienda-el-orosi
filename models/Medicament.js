const { model, Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const moment = require("moment");

let dateTime = new Date();

const MedicamentSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  milliliters: {
    type: Number,
    required: true,
  },

  unit_price: {
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

MedicamentSchema.plugin(mongoosePaginate);

module.exports = model("Medicament", MedicamentSchema);
