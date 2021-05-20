const { model, Schema } = require("mongoose");
const moment = require("moment");

let dateTime = new Date();

const PaymentSchema = Schema({
  administrator: { type: Schema.ObjectId, ref: "User" },
  collaborator: { type: Schema.ObjectId, ref: "Collaborator" },
  pay_date: {
    type: String,
    default: () => moment(dateTime).format("YYYY-MM-DD"),
    require: true,
  },
  invoice_number: {
    type: Number,
    require: true,
    unique: true,
  },
  collaborator_job_name: {
    type: String,
    require: true,
  },
  total_days_worked: {
    type: Number,
    require: true,
  },
  total_hours_worked: {
    type: Number,
    require: true,
  },
  total_extra_hours_price: {
    type: Number,
    require: true,
  },
  extra_hours_price: {
    type: Number,
    require: true,
  },
  price_day: {
    type: Number,
    require: true,
  },
  net_salary: {
    type: Number,
    require: true,
  },
  total_salary: {
    type: Number,
    require: true,
  },
});

module.exports = model("Payment", PaymentSchema);
