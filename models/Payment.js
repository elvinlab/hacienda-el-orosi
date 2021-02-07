const { model, Schema } = require("mongoose");
const moment = require("moment");

moment.locale("es");

const PaymentShema = Schema({
  administrator: { type: Schema.ObjectId, ref: "Administrator" },
  collaborator: { type: Schema.ObjectId, ref: "Collaborator" },
  pay_day: {
    type: String,
    default: () => moment().format("DD-MM-YYYY"),
    require: true,
  },

  net_salary: {
    type: Number,
    require: true,
  },
  final_salary: {
    type: Number,
    require: true,
  },
  details:{
    type: String,
  }
});

module.exports = model("Payment", PaymentShema);
