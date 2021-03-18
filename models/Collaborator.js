const { model, Schema } = require("mongoose");

let dateTime = new Date();

const CollaboratorSchema = Schema({
  document_id: {
    type: String,
    unique: true,
    required: true,
  },
  administrator: { type: Schema.ObjectId, ref: "Administrator" },
  nationality: {
    type: String,
  },
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  direction: {
    type: String,
  },
  tel: {
    type: String,
  },
  cel: {
    type: String,
  },
  status: {
    type: String,
    default: "active",
  },
  date_admission: {
    type: String,
    default: () => dateTime.toISOString().slice(0, 10),
  },
  dispatch_date: {
    type: String,
  },
});

module.exports = model("Collaborator", CollaboratorSchema);
