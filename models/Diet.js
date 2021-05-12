const { model, Schema } = require("mongoose");
const moment = require("moment");

let dateTime = new Date();

const DietSchema = Schema({
  diet_name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: () => moment(dateTime).format("YYYY-MM-DD"),
    required: true,
  },
});

module.exports = model("Diet", DietSchema);
