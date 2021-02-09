const { model, Schema } = require("mongoose");
const moment = require("moment");
const mongoosePaginate = require("mongoose-paginate-v2");

moment.locale("es");

const PaymentSchema = Schema({
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

PaymentSchema.plugin(mongoosePaginate);

module.exports = model("Payment", PaymentSchema);
