const Contract = require("../models/Contract.js");

const { response } = require("express");

const save = (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
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
        status: true,
        msg: "Contrato realizado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: "Por favor contacté con un ING en Sistemas para más información.",
      });
    }
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No posees los privilegios necesarios en la plataforma.",
    });
  }
};

const getContractsByStatus = (req, res = response) => {
  const status = req.params.status;
  let page = undefined;

  if (
    !req.params.page ||
    req.params.page == 0 ||
    req.params.page == "0" ||
    req.params.page == null ||
    req.params.page == undefined
  ) {
    page = 1;
  } else {
    page = parseInt(req.params.page);
  }
  const options = {
    sort: { starting_date: -1 },
    limit: 10,
    page: page,
  };

  Contract.paginate({ status: status }),
    options.sort([["date_contract", "ascending"]]).exec((err, contracts) => {
      if (err) {
        res.status(500).send({
          status: false,
          msg: "Error en la petición.",
        });
      }

      if (!contracts) {
        res.status(404).send({
          status: false,

          msg: "No hay contratos por mostrar",
        });
      }

      res.status(200).send({
        status: true,
        contracts: {
          contracts: contracts.docs,
          count: contracts.totalDocs,
        },
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
          status: false,
          msg: "Error en la petición",
        });
      }

      if (!contracts) {
        res.status(404).send({
          status: false,
          msg: "No hay contratos por mostrar",
        });
      }
      res.status(200).send({
        status: true,
        contracts,
      });
    });
};

const changeStatus = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    const { status } = req.body;
    const contractId = req.params.id;

    await Contract.findByIdAndUpdate(
      { _id: contractId },
      { status: status },
      (err) => {
        if (err) {
          res.status(400).json({
            status: false,
            msg: "Por favor contacté con un ING en Sistemas para más información.",
          });
        } else {
          res.status(200).send({
            status: true,
            msg: "Estado del contrato actualizado.",
          });
        }
      }
    );
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No posees los privilegios necesarios en la plataforma.",
    });
  }
};

module.exports = {
  save,
  getContractsByStatus,
  getContractsByContracted,
  changeStatus,
};
