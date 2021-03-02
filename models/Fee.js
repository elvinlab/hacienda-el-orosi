const { model, Schema } = require("mongoose");
const moment = require("moment");

const FeeSchema = Schema({
  collaborator: {
    type: Schema.ObjectId,
    ref: "Collaborator",
    required: true,
  },

  lend: {
    type: Schema.ObjectId,
    ref: "Lend",
    required: true,
  },

  date_fee: {
    type: String,
    default: () => moment().format("DD-MM-YYYY"),
    required: true,
  },
});

module.exports = model("Fee", FeeSchema);
