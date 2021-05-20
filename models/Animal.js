const { model, Schema } = require('mongoose');

const MilkSchema = Schema({
  liters: {
    type: Number,
    required: true
  },
  registration_date: {
    type: String,
    required: true
  }
});

const CalvingSchema = Schema({
  date: {
    type: String,
    required: true
  },

  complications: {
    type: String
  }
});

const WeightSchema = Schema({
  weight: {
    type: Number,
    required: true
  },

  date: {
    type: String,
    required: true
  },

  observations: {
    type: String
  }
});

const AnimalSchema = Schema({
  administrator: { type: Schema.ObjectId, ref: 'User' },
  type: { type: Schema.ObjectId, ref: 'Type' },

  plate_number: {
    type: String,
    required: true
  },
  plate_color: {
    type: String,
    required: true
  },

  status: {
    type: String,
    required: true
  },

  date_admission: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },
  place_origin: {
    type: String,
    required: true
  },

  race: {
    type: String
  },

  age: {
    type: String
  },

  daughter_of: {
    type: Schema.ObjectId,
    ref: 'Animal'
  },

  starting_weight: {
    type: Number
  },

  photo_link: {
    type: String
  },

  photo_register: {
    type: String
  },

  next_due_date: {
    type: String
  },

  milk: [MilkSchema],

  calving: [CalvingSchema],

  weight: [WeightSchema]
});

module.exports = model('Animal', AnimalSchema);
