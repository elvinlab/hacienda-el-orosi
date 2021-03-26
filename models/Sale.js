const { model, Schema } = require ("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const moment = require("moment");

const SaleSchema = Schema({

    animal:{
        type: Schema.ObjectId,
        ref: "Animal",
        required: true,
    },

    sale_date: {
        type: String,
        default: () => moment(dateTime).format("YYYY-MM-DD"),
        required: true,
    },

    price: {
        type:Number,

    },

    priceKG: {
        type:Number,
    },

    total_price: {
         type:Number,
         
     },

     sale_type: {
         type: String,
         require: true,
     },
     buyer_name:{
         type:String,
         require:true,
     }
});

SaleSchema.plugin(mongoosePaginate);

module.exports= model( "Sale", SaleSchema);