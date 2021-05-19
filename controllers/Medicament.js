const Medicament = require('../models/Medicament.js');

const { ObjectId } = require('mongodb');
const { response } = require('express');

const save = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Encargado del ganado') {
    const { name, quantity, milliliters, unit_price } = req.body;

    try {
      let medicament = new Medicament();

      medicament.name = name;
      medicament.quantity = quantity;
      medicament.milliliters = milliliters;
      medicament.unit_price = unit_price;

      await medicament.save();

      return res.status(200).json({
        status: true,
        msg: 'Medicamento registrado con éxito',
        medicament
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

const getMedicaments = async (req, res = response) => {
  Medicament.find((err, medicaments) => {
    if (err) {
      return res.status(500).send({
        status: false,
        msg: 'Error al hacer la consulta.'
      });
    }

    return res.status(200).json({
      status: true,
      medicaments: medicaments
    });
  });
};

module.exports = {
  save,
  getMedicaments
};
