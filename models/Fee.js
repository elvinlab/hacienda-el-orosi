const { model, Schema } = require("mongoose");

let dateTime = new Date();

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
    default: () => dateTime.toISOString().slice(0, 10),
    required: true,
  },
});

module.exports = model("Fee", FeeSchema);
