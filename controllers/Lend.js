const Lend = require("../models/Lend.js");
const Fee = require("../models/Fee.js");

const { ObjectId } = require("mongodb");
const { response } = require("express");

const make = (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const { collaborator_id, amount } = req.body;

    try {
      let lend = new Lend();

      lend.collaborator = collaborator_id;
      lend.amount = amount;

      lend.save();

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
    const { collaborator_id, lend, fee_week } = req.body;

    try {
      let fee = new Fee();

      fee.collaborator = collaborator_id;
      fee.lend = lend;
      fee.fee_week = fee_week;

      let findLend = await Lend.findById(ObjectId(lend));
      let newAmount = findLend.amount - fee_week;
      let newStatus = findLend.status;

      if (newAmount <= 0) {
        newStatus = "cancel";
        newAmount = 0;
      }

      await Lend.findByIdAndUpdate(
        { _id: lend },
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
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    let collaboratorId = req.params.id;

    await Fee.find({ collaborator: collaboratorId }).exec((err, fees) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          msg: "Error al hacer la consulta",
        });
      }

      if (!fees) {
        return res.status(404).send({
          status: "error",
          msg: "No existe cuota del colaborador.",
        });
      }

      return res.status(200).json({
        status: "success",
        fee: {
          fees: fees,
          count: fees.totalDocs,
          totalPages: fees.totalPages,
        },
      });
    });
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const getLendsByStatus = (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    Lend.find({ status: "active" })
      .populate("collaborator")
      .exec((err, lends) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            msg: "Error al hacer la consulta",
          });
        }

        if (!lends) {
          return res.status(404).send({
            status: "error",
            msg: "No hay prestamos registrados",
          });
        }

        return res.status(200).json({
          status: "success",
          lends: lends,
        });
      });
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const getRecords = (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    Lend.find({ status: "cancel" }).exec((err, lends) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          msg: "Error al hacer la consulta",
        });
      }

      if (!lends) {
        return res.status(404).send({
          status: "error",
          msg: "No hay prestamos registrados",
        });
      }

      return res.status(200).json({
        status: "success",
        lends: {
          lends: lends,
          count: lends.totalDocs,
          totalPages: lends.totalPages,
        },
      });
    });
  } else {
    res.status(500).json({
      status: "Error",
      msg: "No tienes permisos en la plataforma",
    });
  }
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
  getRecords,
  deleteLend,
};
