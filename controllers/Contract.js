const Contract = require("../models/Contract.js");

const { response } = require("express");

const save = (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const {
      name_contracted,
      document_id,
      date_contract,
      date_pay,
      name_job,
      amount,
      number_phone,
      email,
    } = req.body;

    try {
      let contract = new Contract();

      contract.administrator = req.user.id;
      contract.name_contracted = name_contracted;
      contract.document_id = document_id;
      contract.date_contract = date_contract;
      contract.date_pay = date_pay;
      contract.name_job = name_job;
      contract.amount = amount;
      contract.number_phone = number_phone;
      contract.email = email;

      contract.save();

      return res.status(200).json({
        status: "success",
        msg: "Contrato realizado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "Por favor hable con el administrador encargado",
      });
    }
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const getContracts = (req, res = response) => {
  const status = req.params.status;

  Contract.find({ status: status })
    .sort([["date_contract", "ascending"]])
    .exec((err, contracts) => {
      if (err) {
        res.status(500).send({
          status: "error",
          msg: "Error en la peticion",
        });
      }

      if (!contracts) {
        res.status(404).send({
          status: "error",
          msg: "No hay pagos por mostrar",
        });
      }
      res.status(200).send({
        status: "success",
        contracts,
      });
    });
};

const getContractsByContracted = (req, res = response) => {
  const status = req.params.status;
  const document_id = req.params.id;

  Contract.find({ status: status, document_id: document_id })
    .sort([["date_contract", "ascending"]])
    .exec((err, contracts) => {
      if (err) {
        res.status(500).send({
          status: "error",
          msg: "Error en la peticion",
        });
      }

      if (!contracts) {
        res.status(404).send({
          status: "error",
          msg: "No hay pagos por mostrar",
        });
      }
      res.status(200).send({
        status: "success",
        contracts,
      });
    });
};

const changeStatus = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const { status } = req.body;
    const contractId = req.params.id;

    await Contract.findByIdAndUpdate(
      { _id: contractId },
      { status: status },
      (err) => {
        if (err) {
          res.status(400).json({
            status: "error",
            msg: "Por favor hable con el administrador",
          });
        } else {
          res.status(200).send({
            status: "success",
            msg: "Estado actualizado para este contrato",
          });
        }
      }
    );
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

module.exports = {
  save,
  getContracts,
  getContractsByContracted,
  changeStatus,
};
