const { model, Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const moment = require("moment");

let dateTime = new Date();

const MilkSchema = Schema({
  liters: {
    type: Number,
    required: true,
  },
  registration_date: {
    type: String,
    default: () => moment(dateTime).format("YYYY-MM-DD"),
    required: true,
  },
});

model("Milk", MilkSchema);

const AnimalSchema = Schema({
  administrator: {
    type: Schema.ObjectId,
    ref: "Administrator",
    required: true,
  },

  plate_number: {
    type: String,
    required: true,
  },

  type_animal: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },

  date_admission: {
    type: String,
    required: true,
  },

  race: {
    type: String,
  },

  age: {
    type: Number,
  },

  daughter_of: {
    type: Schema.ObjectId,
    ref: "Animal",
  },

  weight: {
    type: Number,
  },

  weekly_weight: {
    type: Number,
  },

  place_origin: {
    type: String,
  },

  name: {
    type: String,
  },

  photo: {
    type: String,
  },

  photo_register: {
    type: String,
  },

  gender: {
    type: String,
  },

  next_due_date: {
    type: String,
  },

  complications: {
    type: String,
  },

  number_deliveries: {
    type: Number,
  },

  milks: [MilkSchema],
});

AnimalSchema.plugin(mongoosePaginate);

module.exports = model("Animal", AnimalSchema);
