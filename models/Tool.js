const { model, Schema } = require("mongoose");
const moment = require("moment");
const mongoosePaginate = require("mongoose-paginate-v2");

const ToolSchema = Schema({
  active_num: {
    type: Number,
    unique: true,
    required: true,
  },
  administrator: { type: Schema.ObjectId, ref: "Administrator" },
  status: {
    type: String,
    default: "stock",
    required: true,
  },
  name: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    default: () => moment().format("DD-MM-YYYY"),
    required: true,
  },
  liters: {
    type: Number,
  },
});

ToolSchema.plugin(mongoosePaginate);

module.exports = model("Tool", ToolSchema);
