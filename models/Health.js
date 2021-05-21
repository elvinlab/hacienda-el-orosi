const { model, Schema } = require("mongoose");
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
    required: true,
  }, 
  
  human_consumed_date: {
    type: String,
    required: true,
  },
});

module.exports = model("Health", HealthSchema);
