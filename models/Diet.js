const { model, Schema } = require("mongoose");

const DietSchema = Schema({

  diet_name: {
    type: String,
    required: true,
    unique: true,
  },
  animal: { type: Schema.ObjectId, ref: "Animal" },
  aliment: { type: Schema.ObjectId, ref: "Product" },
});

module.exports = model("Diet", DietSchema);