const { model, Schema } = require( 'mongoose' );
const moment =  require('moment');
const mongoosePaginate = require("mongoose-paginate-v2");

moment.locale( 'es' );

const FeeSchema = Schema({
    collaborator: { 
        type: Schema.ObjectId, 
        ref: 'Collaborator',
        required: true,
    },

    lend: {
        type: Schema.ObjectId, 
        ref: 'Lend',
        required: true,
    },

    date_fee: {
        type: String,
        default: () => moment().format("DD-MM-YYYY"),
        required: true,
    },

    fee_week: {
        type: Number,
        required: true,
    }
});

FeeSchema.plugin(mongoosePaginate);

module.exports = modeFeeSchemal( 'Fee', FeeSchema );