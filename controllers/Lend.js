const Lend = require('../models/Lend.js');
const Fee = require('../models/Fee.js');
const Collaborator = require('../models/Collaborator.js');
const { ObjectId } = require('mongodb');
const { response } = require('express');

const make = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Recursos Humanos') {
    const { collaborator_id, initial_amount, fee_amount } = req.body;

    try {
      if (fee_amount >= initial_amount || fee_amount < 5000) {
        return res.status(400).json({
          status: false,
          msg: 'La cuota no puede ser mayor al prestamo inicial o menor a 5,000.'
        });
      }

      let lend = new Lend();

      lend.collaborator = collaborator_id;
      lend.initial_amount = initial_amount;
      lend.amount = initial_amount;
      lend.fee = fee_amount;

      await lend.save();

      return res.status(200).json({
        status: true,
        msg: 'Préstamo realizado con éxito.',
        lend: lend
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: 'Por favor contacté con un ING en Sistemas para más información.'
      });
    }
  } else {
    res.status(500).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const changeAmountFee = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Recursos Humanos') {
    const { newFee } = req.body;
    const lendId = req.params.id;

    await Lend.findByIdAndUpdate({ _id: lendId }, { fee: newFee }, { new: true }, (err, lend) => {
      if (err) {
        res.status(400).json({
          status: false,
          msg: 'Por favor contacté con un ING en Sistemas para más información.'
        });
      } else {
        res.status(200).send({
          status: true,
          msg: 'Se actualizo la cuota semanal.',
          lend: lend
        });
      }
    }).populate('collaborator');
  } else {
    res.status(500).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const registerFee = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Recursos Humanos') {
    const { collaborator_id, lend_id } = req.body;

    try {
      let fee = new Fee();

      fee.collaborator = collaborator_id;
      fee.lend = lend_id;

      let findLend = await Lend.findById(ObjectId(lend_id));
      let newAmount = findLend.amount - findLend.fee;
      let newStatus = findLend.status;

      if (newAmount <= 0) {
        newStatus = 'Cancelado';
        newAmount = 0;
      }

      await Lend.findByIdAndUpdate(
        { _id: lend_id },
        { amount: newAmount, status: newStatus },
        (err) => {
          if (err) {
            res.status(400).json({
              status: false,
              msg: 'Por favor contacté con un ING en Sistemas para más información.'
            });
          }
        }
      );

      await fee.save();

      return res.status(200).json({
        status: true,
        msg: 'Abono realizado con éxito.'
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: 'Por favor contacté con un ING en Sistemas para más información.'
      });
    }
  } else {
    res.status(500).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

const getFeesByLend = async (req, res = response) => {
  let lend_id = req.params.id;
  Fee.find({ lend: lend_id }).exec((err, fees) => {
    if (err) {
      return res.status(404).send({
        status: false,
        msg: 'Error en la consulta'
      });
    }

    return res.status(200).json({
      status: true,
      fees: fees
    });
  });
};

const getLendsByStatus = (req, res = response) => {
  let status = req.params.status;

  Lend.find({ status: status }, (err, lends) => {
    if (err) {
      return res.status(500).send({
        status: false,
        msg: 'Error al hacer la consulta'
      });
    }

    return res.status(200).json({
      status: true,
      lends
    });
  }).populate('collaborator');
};

const getLendsByCollaborator = async (req, res = response) => {
  let collaborator_document_id = req.params.id;

  let findCollaboratorByDocumentId = await Collaborator.findOne({
    document_id: collaborator_document_id
  });

  if (!findCollaboratorByDocumentId) {
    return res.status(400).json({
      status: false,
      msg: 'Esta cédula de identidad no se encuentra registrada.'
    });
  }
  await Lend.find({ collaborator: ObjectId(findCollaboratorByDocumentId._id) }, (err, lends) => {
    if (err) {
      return res.status(500).send({
        status: false,
        msg: 'Error al hacer la consulta'
      });
    }

    return res.status(200).json({
      status: true,
      lends: lends
    });
  });
};

const deleteLend = async (req, res = response) => {
  if (req.user.role === 'Dueño' || req.user.role === 'Recursos Humanos') {
    const { lendId } = req.body;

    let findLend = await Fee.findOne({ lend: ObjectId(lendId) });

    if (findLend) {
      return res.status(400).json({
        status: false,
        msg: 'Préstamo no cancelado.'
      });
    }

    let lendRemoved = await Lend.findOneAndDelete({ _id: ObjectId(lendId) });

    if (!lendRemoved) {
      return res.status(404).send({
        status: false,
        msg: 'No se encuentran registros de este préstamo.'
      });
    }
    return res.status(200).json({
      status: true,
      msg: 'Removido de forma con éxito.'
    });
  } else {
    res.status(500).json({
      status: false,
      msg: 'No posees los privilegios necesarios en la plataforma.'
    });
  }
};

module.exports = {
  make,
  registerFee,
  changeAmountFee,
  getFeesByLend,
  getLendsByCollaborator,
  getLendsByStatus,
  deleteLend
};
