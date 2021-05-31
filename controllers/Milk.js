const Animal = require('../models/Animal.js');
const moment = require('moment');
const { response } = require('express');

const addRegisterMilk = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Encargado del ganado') {
    const { liters, registration_date } = req.body;
    const cowID = req.params.id;

    try {
      let cow = await Animal.findById({ _id: cowID }).populate('daughter_of type');

      if (!cow || cow.type.name != 'VACA LECHERA' || cow.status == 'VENDIDO') {
        return res.status(400).json({
          status: false,
          msg: 'Vaca no registrada o no se encuentra en la hacienda.'
        });
      }

      await cow.milk.unshift({
        liters: liters,
        registration_date: moment(registration_date).format('YYYY-MM-DD')
      });

      await cow.save();

      return res.status(200).json({
        status: true,
        msg: 'Registro de leche guardado con éxito.',
        cow: cow
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: 'Por favor contacté con un ING en Sistemas para más información'
      });
    }
  } else {
    return res.status(500).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const updateRegisterMilk = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Encargado del ganado') {
    const { liters, registration_date } = req.body;
    const cowID = req.params.cow;
    const milkID = req.params.milk;

    try {
      let validate = false;
      let dateTime = new Date();

      let cow = await Animal.findById({ _id: cowID });

      cow &&
        cow.milk.forEach((element) => {
          if (element._id == milkID) {
            if (element.registration_date != moment(dateTime).format('YYYY-MM-DD')) {
              validate = true;
            }
          }
        });

      if (validate) {
        return res.status(400).json({
          status: false,
          msg: 'No se puede actualizar, la fecha es diferente en el registro.'
        });
      }

      Animal.findOneAndUpdate(
        { 'milk._id': milkID },
        {
          $set: {
            'milk.$.liters': liters,
            'milk.$.registration_date': registration_date
          }
        },
        { new: true },
        (err, cow) => {
          if (err) {
            return res.status(500).send({
              status: 'error',
              message: 'Error en la petición.'
            });
          }

          if (!cow) {
            return res.status(404).send({
              status: 'error',
              message: 'No existe registro.'
            });
          }
          return res.status(200).send({
            status: true,
            msg: 'Datos actualizados con éxito.',
            cow: cow
          });
        }
      );
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: 'Por favor contacté con un ING en Sistemas para más información'
      });
    }
  } else {
    return res.status(500).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const deleteRegisterMilk = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Encargado del ganado') {
    const cowID = req.params.cow;
    const milkID = req.params.milk;

    try {
      let validate = false;
      let dateTime = new Date();

      let cow = await Animal.findById({ _id: cowID }).populate('daughter_of type');

      cow &&
        cow.milk.forEach((element) => {
          if (element._id == milkID) {
            if (element.registration_date != moment(dateTime).format('YYYY-MM-DD')) {
              validate = true;
            }
          }
        });

      if (validate) {
        return res.status(400).json({
          status: false,
          msg: 'No se puede actualizar, la fecha es diferente en el registro.'
        });
      }

      let regMilk = await cow.milk.id(milkID);

      regMilk.remove();

      await cow.save();

      return res.status(200).json({
        status: true,
        msg: 'Registro eliminado con éxito.',
        animal: cow
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: 'Por favor contacté con un ING en Sistemas para más información'
      });
    }
  } else {
    return res.status(500).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

module.exports = {
  addRegisterMilk,
  updateRegisterMilk,
  deleteRegisterMilk
};
