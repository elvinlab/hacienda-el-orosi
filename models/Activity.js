const { model, Schema } = require("mongoose");

let dateTime = new Date();

const ActivitySchema = Schema({
  job: { type: Schema.ObjectId, ref: "Job" },
  collaborator: { type: Schema.ObjectId, ref: "Collaborator" },
  date: {
    type: String,
    default: () => dateTime.toISOString().slice(0, 10),
  },
});

module.exports = model("Activity", ActivitySchema);