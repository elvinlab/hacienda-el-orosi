const { model, Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
    default: "stock",
    required: true,
  },
  name: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    default: () => dateTime.toISOString().slice(0, 10),
    required: true,
  },
  liters: {
    type: Number,
  },
});

ToolSchema.plugin(mongoosePaginate);

module.exports = model("Tool", ToolSchema);
