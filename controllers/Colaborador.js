const Colaborador = require( '../models/Colaborador.js' );

const { response } = require ( 'express' );
const { request } = require('../Express_server.js');
const app = require('../Express_server.js');

const register = (req, res = response ) => { 
  /*  if ( ( req.user.role === 'planilla' ) || ( req.user.role ==='general' ) ) {
        console.log('soy el administrador');
    } else {
       return res.status( 500 ).json({
           status: 'Error',
           msg: 'Por favor contacte con el Administrador para mas información',
       });
    }*/
    const { cedula, nacionalidad, nombre, apellido, direccion, telefono, celular,
            fecha_ingreso, fecha_despacho} = req.body;

    try {
        let colaborador = new Colaborador();
        colaborador.cedula = cedula;
        colaborador.nacionalidad = nacionalidad;
        colaborador.nombre = nombre;
        colaborador.apellido = apellido;
        colaborador.direccion = direccion;
        colaborador.telefono = telefono;
        colaborador.celular = celular;
       // colaborador.fecha_ingreso = fecha_ingreso;
        //colaborador.fecha_despacho = fecha_despacho;
        
        colaborador.save();

        return res.status( 200 ).json({
            status: 'success',
            msg: 'Colaborador registrado con exito',
        })

    } catch( error ) {
        return res.status( 500 ).json({
            status: 'Error',
            msg: 'Por favor contacte con el Administrador para mas información',
        });
    }
};

module.exports = {
    register,
 };