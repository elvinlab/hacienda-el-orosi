const { model, Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

let dateTime = new Date();

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
    default: () => moment(dateTime).format("YYYY-MM-DD"),
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

ContractSchema.plugin(mongoosePaginate);

module.exports = model("Contract", ContractSchema);