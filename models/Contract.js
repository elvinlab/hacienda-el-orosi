const { model, Schema } = require("mongoose");
const moment = require("moment");

moment.locale("es");

const ContractSchema = Schema({
  administrator: {
    type: Schema.ObjectId,
    ref: "Administrator",
    required: true,
  },

  name_contracted: {
    type: String,
    required: true,
  },

  document_id: {
    type: String,
    required: true,
  },

  date_contract: {
    type: String,
    default: () => moment().format("DD-MM-YYYY"),
    required: true,
  },

  date_pay: {
    type: String,
    required: true,
  },

  name_job: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  number_phone: {
    type: Number,
    required: true,
  },

  email: {
    type: String,
  },

  status: {
    type: String,
    default: "active",
    required: true,
  },
});

module.exports = model("Contract", ContractSchema);