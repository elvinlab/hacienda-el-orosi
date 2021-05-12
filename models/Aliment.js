const { model, Schema } = require("mongoose");

const AlimentSchema = Schema({
  diet: {
    type: Schema.ObjectId,
    ref: "Diet",
    required: true,
  },

  product: {
    type: Schema.ObjectId,
    ref: "Product",
    required: true,
  },

  quantity_supplied: {

    type: Number,
    required: true,
  },
});

module.exports = model("Aliment", AlimentSchema);
