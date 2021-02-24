const Tool = require("../models/Tool.js");
const { response } = require("express");

const registrerTool = async (req, res = response) => {
  const { name, liters } = req.body;

  try {
    let tool = new Tool();
    tool.administrator = req.user.id;
    (tool.active_num = Math.floor(Math.random() * (999999 - 100000) + 100000)),
      (tool.name = name);
    tool.liters = liters;

    await tool.save();

    return res.status(200).json({
      status: "success",
      msg: "Herramienta registrada con exito",
    });
  } catch (error) {
    return res.status(500).json({
      status: "Error",
      msg: "Porfavor contacte con un administrador para mas informacion",
    });
  }
};

const getTools = (req, res = response) => {
  if (req.user.role === "GENERAL_ROLE" || req.user.role === "RESOURCES_ROLE") {
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
      sort: { date: -1 },
      limit: 5,
      page: page,
    };
    Tool.paginate({}, options, (err, tools) => {
      if (err) {
        return res.status(500).send({
          status: "error",
          msg: "Error al hacer la consulta",
        });
      }

      if (!tools) {
        return res.status(404).send({
          status: "error",
          msg: "no se encuentran herramientas registradas en la aplicacion",
        });
      }
      return res.status(200).json({
        status: "success",
        tools: {
          tools: tools.docs,
          count: tools.totalDocs,
          totalPages: tools.totalPages,
        },
      });
    });
  } else {
    res.status(500).json({
      status: "Error",
      msg:
        "No se posee los permisos necesarios en la plataforma para esta funcion",
    });
  }
};

const changeStatus = async (req, res = response) => {
    const { status } = req.body;
    const toolId = req.params.id;

    await Tool.findByIdAndUpdate({ _id: toolId }, { status: status }, (err) => {
      if (err) {
        res.status(400).json({
          status: "error",
          msg: "por favor hable con el administrador para mas informacion",
        });
      } else {
        res.status(200).send({
          status: "success",
          msg: "Estado actualizado del Activo",
        });
      }
    });

};

const getToolsByStatus = (req, res = response) => {
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
    sort: { date: -1 },
    limit: 5,
    page: page,
  };

  Tool.paginate({ status: status }, options, (err, tools) => {
    if (err) {
      return res.status(500).send({
        status: "error",
        msg: "Error al hacer la consulta",
      });
    }

    return res.status(200).json({
      status: "success",
      tools: {
        tools: tools.docs,
        count: tools.totalDocs,
        totalPages: tools.totalPages,
      },
    });
  });
};
module.exports = {
  registrerTool,
  getTools,
  changeStatus,
  getToolsByStatus,
};
