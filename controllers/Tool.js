const Tool = require("../models/Tool.js");
const Active = require("../models/Active.js");
const { ObjectId } = require("mongodb");

const { response } = require("express");

const registerTool = async (req, res = response) => {
  const { name, liters } = req.body;

  try {
    let tool = new Tool();
    tool.administrator = req.user.id;
    (tool.active_num = Math.floor(Math.random() * (999999 - 100000) + 100000)),
      (tool.name = name);
    tool.liters = liters;

    await tool.save();

    return res.status(200).json({
      status: true,
      msg: "Herramienta registrada.",
      tool: tool,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      msg: "Por favor contacté con un ING en Sistemas para más información.",
    });
  }
};

const registerActives = async (req, res = response) => {
  const { tools } = req.body;
  tools.forEach(async function (element) {
    active = new Active();

    active.collaborator = element.collaborator_id;
    active.tool = element.tool_id;

    await active.save();

    await Tool.findOneAndUpdate(
      { _id: element.tool_id },
      { status: "ACTIVO" },
      (err) => {
        if (err) {
          return res.status(500).send({
            status: false,
            msg: "Error en la operación.",
          });
        }
      }
    );
  });

  return res.status(200).json({
    status: true,
    msg: "Herramientas asignadas con éxito.",
  });
};

const changeStatus = async (req, res = response) => {
  const { status } = req.body;
  const toolId = req.params.id;

  await Tool.findByIdAndUpdate({ _id: toolId }, { status: status }, {new: true}, (err, tool) => {
    if (err) {
      res.status(400).json({
        status: false,
        msg: "Por favor contacté con un ING en Sistemas para más información.",
      });
    } else {
      res.status(200).send({
        status: true,
        msg: "Estado actualizado de la Herramienta.",
        tool: tool
      });
    }
  });
};

const getToolsByStatus = (req, res = response) => {
  const status = req.params.status;

  Tool.find({ status })
    .sort({ name: 1 })
    .exec((err, tools) => {
      if (err) {
        return res.status(404).send({
          status: false,
          msg: "Error al hacer la consulta.",
        });
      }

      return res.status(200).json({
        status: true,
        tools: {
          toolsState: status,
          tools: tools,
          count: tools.length,
        },
      });
    });
};

const getActives = async (req, res = response) => {
  const actives = await Active.find().populate("collaborator tool");
  return res.status(200).json({
    status: true,
    actives: {
      actives: actives,
      count: actives.length,
    },
  });
};

const getActivesByCollaborator = (req, res = response) => {
  const collaborator_id = req.params.id;

  Active.find({ collaborator: ObjectId(collaborator_id) })
    .populate("tool")
    .sort({ name: 1 })
    .exec((err, actives) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: "Error al hacer la consulta.",
        });
      }

      return res.status(200).json({
        status: true,
        actives: {
          actives: actives,
          count: actives.length,
        },
      });
    });
};

const deleteActivesTool = async (req, res = response) => {
  const { tools } = req.body;

  tools.forEach(async function (element) {
    await Tool.findByIdAndUpdate(
      { _id: element.tool_id },
      { status: "En bodega" },
      (err) => {
        if (err) {
          return res.status(400).json({
            status: false,
            msg: "Por favor contacté con un ING en Sistemas para más información.",
          });
        }
      }
    );

    await Active.findOneAndDelete(
      { tool: ObjectId(element.tool_id) },
      (err) => {
        if (err) {
          return res.status(500).send({
            status: false,
            msg: "Error al solicitar la peticion.",
          });
        }
      }
    );
  });

  return res.status(200).json({
    status: true,
    msg: "Herramienta devuelta.",
  });
};

module.exports = {
  registerTool,
  registerActives,
  changeStatus,
  getToolsByStatus,
  getActives,
  getActivesByCollaborator,
  deleteActivesTool,
};
