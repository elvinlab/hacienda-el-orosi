const { model, Schema } = require("mongoose");
const moment = require("moment");

let dateTime = new Date();

const ToolSchema = Schema({
  active_num: {
    type: Number,
    unique: true,
    required: true,
  },
  administrator: { type: Schema.ObjectId, ref: "Administrator" },
  status: {
    type: String,
    default: "En bodega",
    required: true,
  },
  name: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    default: () => moment(dateTime).format("YYYY-MM-DD"),
    required: true,
  },
  liters: {
    type: Number,
  },
});

module.exports = model("Tool", ToolSchema);
