const Lend = require("../models/Lend.js");
const Fee = require("../models/Fee.js");
const Collaborator = require("../models/Collaborator.js");
const { ObjectId } = require("mongodb");
const { response } = require("express");

const make = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const { collaborator_id, initial_amount, fee_amount } = req.body;

    try {
      if (fee_amount >= initial_amount || fee_amount < 5000) {
        return res.status(400).json({
          status: "error",
          msg:
            "La cuota no puede ser mayor al prestamo inicial o menor a 5,000",
        });
      }

      let lend = new Lend();

      lend.collaborator = collaborator_id;
      lend.initial_amount = initial_amount;
      lend.amount = initial_amount;
      lend.fee = fee_amount;

      await lend.save();

      return res.status(200).json({
        status: "success",
        msg: "Prestamo realizado exitosamente",
        lend: lend,
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

const changeAmountFee = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const { newFee } = req.body;
    const lendId = req.params.id;

    await Lend.findByIdAndUpdate(
      { _id: lendId },
      { fee: newFee },
      { new: true },
      (err, lend) => {
        if (err) {
          res.status(400).json({
            status: "error",
            msg: "Por favor hable con el administrador",
          });
        } else {
          res.status(200).send({
            status: "success",
            msg: "Se actualizo la cuota semanal",
            lend: lend,
          });
        }
      }
    ).populate("collaborator");
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

const getFeesByLend = async (req, res = response) => {
  let lend_id = req.params.id;
  Fee.find({ lend: lend_id }).exec((err, fees) => {
    if (err) {
      return res.status(404).send({
        status: "error",
        msg: "Error al hacer la consulta",
      });
    }

    return res.status(200).json({
      status: "success",
      fees: fees,
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
    limit: 10,
    page: page,
    populate: "collaborator",
  };

  Lend.paginate({ status: status }, options, (err, lends) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        msg: "Error al hacer la consulta",
      });
    }

    return res.status(200).json({
      status: "success",
      lends: {
        lendsState: status,
        lends: lends.docs,
        count: lends.totalDocs,
      },
    });
  });
};

const getLendsByCollaborator = async (req, res = response) => {
  let collaborator_document_id = req.params.id;
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
    sort: { status: 1 },
    limit: 10,
    page: page,
    populate: "collaborator",
  };

  let findCollaboratorByDocumentId = await Collaborator.findOne({
    document_id: collaborator_document_id,
  });

  if (!findCollaboratorByDocumentId) {
    return res.status(400).json({
      status: "Error",
      msg: "Ningun colalorador con esta cedula.",
    });
  }
  await Lend.paginate(
    { collaborator: ObjectId(findCollaboratorByDocumentId._id) },
    options,
    (err, lends) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          msg: "Error al hacer la consulta",
        });
      }

      if (lends.docs.length === 0) {
        return res.status(400).json({
          status: "Error",
          msg: "Este colaborador no tiene prestamos registrados.",
        });
      }

      return res.status(200).json({
        status: "success",
        lends: {
          lends: lends.docs,
          count: lends.totalDocs,
        },
      });
    }
  );
};

const deleteLend = async (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
    const { lendId } = req.body;

    let findLend = await Fee.findOne({ lend: ObjectId(lendId) });

    if (findLend) {
      return res.status(400).json({
        status: "Error",
        msg: "Este prestamo se encuentra en continuidad.",
      });
    }

    let lendRemoved = await Lend.findOneAndDelete({ _id: ObjectId(lendId) });

    if (!lendRemoved) {
      return res.status(404).send({
        status: "error",
        msg: "Prestamo no existe en la base de datos",
      });
    }
    return res.status(200).json({
      status: "success",
      msg: "Removido de forma exitosa",
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
  changeAmountFee,
  getFeesByLend,
  getLendsByCollaborator,
  getLendsByStatus,
  deleteLend,
};
