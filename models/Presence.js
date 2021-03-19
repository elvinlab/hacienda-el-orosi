const { model, Schema } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

let dateTime = new Date();

const PresenceSchema = Schema({
  administrator: { type: Schema.ObjectId, ref: "Administrator" },
  collaborator: { type: Schema.ObjectId, ref: "Collaborator" },
  date: {
    type: String,
    default: () => dateTime.toISOString().slice(0, 10),
  },

  total_overtime: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    default: "pending",
    required: true,
  },
});

PresenceSchema.plugin(mongoosePaginate);

module.exports = model("Presence", PresenceSchema);
