const { model, Schema } = require("mongoose");
const moment = require("moment");

let dateTime = new Date();

const PresenceSchema = Schema({
  administrator: { type: Schema.ObjectId, ref: "User" },
  collaborator: { type: Schema.ObjectId, ref: "Collaborator" },
  date: {
    type: String,
    default: () => moment(dateTime).format("YYYY-MM-DD"),
  },

  total_overtime: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    default: "Pendiente",
    required: true,
  },
});

module.exports = model("Presence", PresenceSchema);
