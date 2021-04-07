const { model, Schema } = require("mongoose");

const CollaboratorSchema = Schema({
  document_id: {
    type: String,
    unique: true,
    required: true,
  },
  contract_number: {
    type: Number,
    required: true,
    unique: true,
  },

  administrator: { type: Schema.ObjectId, ref: "User" },
  job: { type: Schema.ObjectId, ref: "Job" },
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
    default: "Activo",
  },
  date_admission: {
    type: String,
    required: true,
  },

  dispatch_date: {
    type: String,
    required: true,
  },
});

module.exports = model("Collaborator", CollaboratorSchema);
