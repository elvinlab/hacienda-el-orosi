const Health = require('../models/Health.js');

const { ObjectId } = require('mongodb');
const { response } = require('express');

const moment = require('moment');

const register = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Encargado del ganado') {
    const animalID = req.params.id;
    const { medicamentID, dose, administrator_date, human_consumed_date } = req.body;

    if (moment(administrator_date) >= moment(human_consumed_date)) {
      return res.status(400).json({
        status: false,
        msg: 'La fecha de administracion no puede superar o ser igual a la fecha de consumo humano.'
      });
    }

    try {
      let health = new Health();

      health.animal = animalID;
      health.medicament = medicamentID;
      health.dose = dose; //Hacer que se reste a la cantidad de mililitros en medicamento
      health.administrator_date = moment(administrator_date).format('YYYY-MM-DD');
      health.human_consumed_date = moment(human_consumed_date).format('YYYY-MM-DD');

      await health.save();

      let newHealth = await Health.findById({ _id: health._id }).populate('animal medicament');

      return res.status(200).json({
        status: true,
        msg: 'Registro de salud registrado con éxito',
        health: newHealth,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: 'Por favor contacté con un ING en Sistemas para más información'
      });
    }
  } else {
    return res.status(400).send({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const getMedicalRecords = async (req, res = response) => {
  Health.find((err, health) => {
    if (err) {
      return res.status(500).send({
        status: false,
        msg: 'Error al hacer la consulta.'
      });
    }
    return res.status(200).json({
      status: true,
      health: health
    });
  }).populate('animal medicament');
};

const getHealthByAnimal = (req, res = response) => {
  const animalID = req.params.id;

  Health.find({ animal: ObjectId(animalID) })
    .populate('Animal Medicament')
    .sort({ name: 1 })
    .exec((err, health) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: 'Error al hacer la consulta'
        });
      }

      return res.status(200).json({
        status: true,
        health: {
          health: health
        }
      });
    });
};

module.exports = {
  register,
  getMedicalRecords,
  getHealthByAnimal
};
