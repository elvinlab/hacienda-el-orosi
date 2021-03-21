const Contract = require("../models/Contract.js");

const { response } = require("express");

const save = (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const {
      name_contracted,
      id_contracted,
      email_contracted,
      address,
      cel,
      phone,
      starting_amount,
      final_amount,
      total_amount,
      starting_date,
      deadline,
      deliver_date,
      description,
      observations,
    } = req.body;

    try {
      let contract = new Contract();

      contract.administrator = req.user.id;
      contract.name_contracted = name_contracted;
      contract.id_contracted = id_contracted;
      contract.num_contract = Math.floor(
        Math.random() * (999999 - 100000) + 100000
      );
      contract.starting_date = starting_date;
      contract.deadline = deadline;
      contract.deliver_date = deliver_date;
      contract.description = description;
      contract.starting_amount = starting_amount;
      contract.final_amount = final_amount;
      contract.total_amount = total_amount;
      contract.email_contracted = email_contracted;
      contract.address = address;
      contract.cel = cel;
      contract.phone = phone;
      contract.observations = observations;

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

  Contract.find({ status: status, id_contracted: document_id })
    .sort([["date_contract", "ascending"]])
    .exec((err, contracts) => {
      if (err) {
        res.status(500).send({
          status: "error",
          msg: "Error en la petición",
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
