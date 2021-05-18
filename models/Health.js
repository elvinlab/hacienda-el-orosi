const { model, Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const moment = require("moment");

let dateTime = new Date();
const HealthSchema = Schema({
  animal: {
    type: Schema.ObjectId,
    ref: "Animal",
    required: true,
  },
  medicament: {
    type: Schema.ObjectId,
    ref: "Medicament",
    required: true,
  },
  administrator: {
    type: Schema.ObjectId,
    ref: "User",
  },
  dose: {
    type: Number,
    required: true,
  },
  administrator_date: {
    type: String,
    default: () => moment(dateTime).format("YYYY-MM-DD"),
  }, //Change to a date that the user can select
  
  human_consumed_date: {
    type: String,
  },
});
HealthSchema.plugin(mongoosePaginate);

module.exports = model("Health", HealthSchema);
