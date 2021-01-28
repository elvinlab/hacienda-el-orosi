const { model, Schema } = require( 'mongoose' );
const moment =  require('moment');
const mongoosePaginate = require('mongoose-paginate-v2');

moment.locale( 'es' );

const ColaboradorSchema = Schema ({ 
    cedula: { 
        type: String,
        required: true,
    },
    administrador: { type: Schema.ObjectId, ref: 'Administrador', },
    actividad: { type: Schema.ObjectId, ref: 'Actividad', },
    nacionalidad: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
       },
    telefono: {
        type: String,
        required: true,
    },
    celular: {
        type: String,
    },
    fecha_ingreso: {
        type: String,
        default: () => moment().format("DD, MM  YYYY, HH:MM:SS"),
       // require: true,
    },
    fecha_despacho: {
        type: String,
        default: () => moment().format("DD, MM  YYYY, HH:MM:SS"),
       // require: true,
    },
}); 

module.exports = model( 'Colaborador', ColaboradorSchema );