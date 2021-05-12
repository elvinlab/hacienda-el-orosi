const Animal = require('../models/Animal.js');
const moment = require('moment');
const { response } = require('express');

const addRegisterCalving = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Encargado del ganado') {
    const animalID = req.params.id;
    const { date, complications } = req.body;

    let animal = await Animal.findById({ _id: animalID }).populate('daughter_of type');

    if (!animal || animal.type.gender != 'Hembra') {
      return res.status(400).json({
        status: false,
        msg: 'Solo se le pueden registrar partos a hembras.'
      });
    }

    await animal.calving.unshift({
      date: moment(date).format('YYYY-MM-DD'),
      complications: complications
    });

    await animal.save();

    return res.status(200).json({
      status: true,
      msg: 'Parto registrado con exito.',
      animal: animal
    });
  } else {
    return res.status(500).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const updateRegisterCalving = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Encargado del ganado') {
    const { date, complications } = req.body;
    const registerCalvingID = req.params.calving;
    const animalID = req.params.animal;

    try {
      let validate = false;
      let dateTime = new Date();
      let animal = await Animal.findById({ _id: animalID });

      animal &&
        animal.calving.forEach((element) => {
          if (element._id == registerCalvingID) {
            if (element.date != moment(dateTime).format('YYYY-MM-DD')) {
              validate = true;
            }
          }
        });

      if (validate) {
        return res.status(400).json({
          status: false,
          msg: 'Número de parto ya registrado o fecha diferente de registro.'
        });
      }

      Animal.findOneAndUpdate(
        { 'calving._id': registerCalvingID },
        {
          $set: {
            'calving.$.date': date,
            'calving.$.complications': complications
          }
        },
        { new: true },
        (err, animal) => {
          if (err) {
            return res.status(500).send({
              status: 'error',
              message: 'Error al registrar los partos.'
            });
          }

          if (!animal) {
            return res.status(404).send({
              status: 'error',
              message: 'Se logro encontran registros existentes.'
            });
          }
          return res.status(200).send({
            status: true,
            msg: 'Datos actualizados con éxito.',
            animal: animal
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

const deleteRegisterCalving = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Encargado del ganado') {
    const registerCalvingID = req.params.calving;
    const animalID = req.params.animal;

    try {
      let animal = await Animal.findById({ _id: animalID }).populate('daughter_of type');

      let regCalving = await animal.calving.id(registerCalvingID);

      regCalving.remove();

      await animal.save();

      return res.status(200).json({
        status: true,
        animal: animal,
        msg: 'El parto fue eliminado.'
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: 'Por favor contacté con un ING en Sistemas para más información.'
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
  addRegisterCalving,
  updateRegisterCalving,
  deleteRegisterCalving
};
