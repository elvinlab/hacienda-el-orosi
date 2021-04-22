const { model, Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const moment = require("moment");

let dateTime = new Date();

const ContractSchema = Schema({
  num_contract: {
    type: Number,
    unique: true,
    require: true,
  },

  administrator: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
  },

  name_contracted: {
    type: String,
    required: true,
  },

  id_contracted: {
    type: String,
    required: true,
  },
  email_contracted: {
    type: String,

    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  cel: {
    type: String,
    require: true,
  },

  phone: {
    type: String,
    require: true,
  },

  starting_amount: {
    type: Number,
    require: true,
  },

  final_amount: {
    type: Number,
    require: true,
  },

  total_amount: {
    type: Number,
    require: true,
  },

  created_at: {
    type: String,
    default: () => moment(dateTime).format("YYYY-MM-DD"),
    require: true,
  },

  starting_date: {
    type: String,
    default: () => dateTime.toISOString().slice(0, 10),
    required: true,
  },

  deadline: {
    type: String,
    default: () => dateTime.toISOString().slice(0, 10),
    required: true,
  },

  deliver_date: {
    type: String,
    default: () => dateTime.toISOString().slice(0, 10),
    
  },

  description: {
    type: String,
    required: true,
  },

  observations: {
    type: String,
   
  },

  status: {
    type: String,
    default: "Activo",
    required: true,
  },
});

ContractSchema.plugin(mongoosePaginate);

module.exports = model("Contract", ContractSchema);
