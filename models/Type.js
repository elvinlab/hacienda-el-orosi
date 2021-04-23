const { model, Schema } = require("mongoose");
const moment = require("moment");

let dateTime = new Date();

const TypeSchema = Schema ({
    administrator: { type: Schema.ObjectId, ref: "User" },
    
    name: {
      type: String,
      unique: true,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    create_at: {
      type: String,
      default: () => moment(dateTime).format("YYYY-MM-DD"),
    },
    
  })

module.exports = model("Type", TypeSchema);
