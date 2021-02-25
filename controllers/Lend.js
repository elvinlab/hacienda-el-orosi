const Lend = require("../models/Lend.js");
const Fee = require("../models/Fee.js");

const { ObjectId } = require("mongodb");
const { response } = require("express");

const make = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const { collaborator_id, initial_amount, fee } = req.body;

    try {
      if (fee >= initial_amount || fee < 5000){
        return res.status(400).json({
          status: "error",
          msg: "La cuota no puede ser mayor al prestamo inicial o menor a 5000",
        });
      }
      let lend = new Lend();

      lend.collaborator = collaborator_id;
      lend.initial_amount = initial_amount;
      lend.amount = initial_amount;
      lend.fee = fee;

      await lend.save();

      return res.status(200).json({
        status: "success",
        msg: "Prestamo realizado exitosamente",
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

const registerFee = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const { collaborator_id, lend_id } = req.body;

    try {
      let fee = new Fee();

      fee.collaborator = collaborator_id;
      fee.lend = lend_id;

      let findLend = await Lend.findById(ObjectId(lend_id));
      let newAmount = findLend.amount - findLend.fee;
      let newStatus = findLend.status;

      if (newAmount <= 0) {
        newStatus = "cancel";
        newAmount = 0;
      }

      await Lend.findByIdAndUpdate(
        { _id: lend_id },
        { amount: newAmount, status: newStatus },
        (err) => {
          if (err) {
            res.status(400).json({
              status: "error",
              msg: "Por favor hable con el administrador",
            });
          }
        }
      );

      await fee.save();

      return res.status(200).json({
        status: "success",
        msg: "Abono realizado exitosamente",
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

const getFeesByCollaborator = async (req, res = response) => {

    let collaboratorId = req.params.id;
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
      sort: { date_fee: -1 },
      limit: 5,
      page: page,
    };

    Fee.paginate({collaborator: ObjectId(collaboratorId)}, options, (err, fees) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          msg: "Error al hacer la consulta",
        });
      }

      return res.status(200).json({
        status: "success",
        fees: {
          fees: fees.docs,
          count: fees.totalDocs,
          totalPages: fees.totalPages,
        },
      });
    });
 
};

const getLendsByStatus = (req, res = response) => {
  let status = req.params.status;
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
    sort: { date_issued: -1 },
    limit: 5,
    page: page,
    populate: "collaborator",
  };

  Lend.paginate({status: status}, options, (err, lends) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        msg: "Error al hacer la consulta",
      });
    }

    return res.status(200).json({
      status: "success",
      lends: {
        lends: lends.docs,
        count: lends.totalDocs,
        totalPages: lends.totalPages,
      },
    });
  });
};

const deleteLend = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const lendId = req.params.id;

    let findLend = await Fee.findById(ObjectId(lendId));
    if (findLend) {
      res.status(500).json({
        status: "Error",
        msg: "Este prestamo se encuentra en continuidad.",
      });
    }

    Lend.findOneAndDelete({ _id: lendId }, (err, lend) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          msg: "Error al solicitar la peticion",
        });
      }
      if (!lend) {
        return res.status(404).send({
          status: "error",
          msg: "No se ha eliminado el prestamo",
        });
      }
      return res.status(200).json({
        status: "success",
        msg: "Removido de forma exitosa",
      });
    });
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

module.exports = {
  make,
  registerFee,
  getFeesByCollaborator,
  getLendsByStatus,
  deleteLend,
};
