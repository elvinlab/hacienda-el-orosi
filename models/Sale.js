const { model, Schema } = require('mongoose');
const moment = require('moment');

let dateTime = new Date();

const SaleSchema = Schema({
  animal: {
    type: Schema.ObjectId,
    ref: 'Animal',
    required: true
  },

  sale_date: {
    type: String,
    default: () => moment(dateTime).format('YYYY-MM-DD'),
    required: true
  },

  price: {
    type: Number
  },

  priceKG: {
    type: Number
  },

  total_price: {
    type: Number
  },

  sale_type: {
    type: String,
    require: true
  },
  buyer_name: {
    type: String,
    require: true
  }
});

module.exports = model('Sale', SaleSchema);
