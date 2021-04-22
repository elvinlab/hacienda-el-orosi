const { model, Schema } = require("mongoose");

const AlimentSchema = Schema({
  name_aliment: {
    type: String,
    required: true,
    unique: true,
  },

  quantity_supplied: {
    type: Number,
    required: true,
  },

  aliment_kg: {
    type: Number,
    required: true,
  },

  price_aliment: {
    type: Number,
    required: true,
  },
});

module.exports = model("Aliment", AlimentSchema);
