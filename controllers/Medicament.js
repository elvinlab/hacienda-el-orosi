const Medicament = require('../models/Medicament.js');
const Health = require('../models/Health.js');

const { ObjectId } = require('mongodb');
const { response } = require('express');

const save = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Encargado del ganado') {
    const { name, quantity, milliliters, unit_price } = req.body;

    try {
      let medicament = new Medicament();
      medicament.active_num = Math.floor(Math.random() * (999999 - 100000) + 100000);
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

const getMedicament = async (req, res = response) => {
  let active_num = req.params.active_num;

  await Medicament.findOne({ active_num: active_num }).exec((err, medicament) => {
    if (err || !medicament) {
      return res.status(404).send({
        status: false,
        msg: 'El medicamento no existe.'
      });
    }

    return res.status(200).send({
      status: true,
      msg: 'Medicamento encontrado',
      medicament: medicament
    });
  });
};

const remove = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Encargado del ganado') {
    const medicamentID = req.params.id;

    if (await Health.findOne({ medicament: ObjectId(medicamentID) })) {
      return res.status(400).send({
        status: false,
        msg: 'No se puede eliminar, este medicamento esta siendo utilizado.'
      });
    }
    Medicament.findOneAndDelete({ _id: medicamentID }, (err, medicament) => {
      if (err || !medicament) {
        return res.status(400).send({
          status: false,
          msg: 'Error, no se pudo eliminar el medicamento.'
        });
      }
      return res.status(200).send({
        status: true,
        msg: 'Medicamento eliminado con éxito.'
      });
    });
  } else {
    return res.status(400).send({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

module.exports = {
  save,
  getMedicaments,
  getMedicament,
  remove
};
