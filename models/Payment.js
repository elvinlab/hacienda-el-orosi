const { model, Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

let dateTime = new Date();

const PaymentSchema = Schema({
  administrator: { type: Schema.ObjectId, ref: "Administrator" },
  collaborator: { type: Schema.ObjectId, ref: "Collaborator" },
  pay_day: {
    type: String,
    default: () => dateTime.toISOString().slice(0, 10),
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
