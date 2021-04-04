const Diet = require("../models/Diet.js");
const Product = require("../models/Product.js");

const { response } = require("express");

const save = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { diet_name, description } = req.body;

    try {
      let diet = new Diet();

      diet.diet_name = diet_name;
      diet.description = description;

      await diet.save();

      return res.status(200).json({
        status: true,
        msg: "Dieta registrada con éxito",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: "Por favor contacte con el administrador para más imformación",
      });
    }
  } else {
    return res.status(400).send({
      status: false,
      msg: "No puedes registrar la dieta",
    });
  }
};

const addAliment = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { name_aliment, quantity_supplied, price_aliment } = req.body;

    try {
      let findAlimentByName = await Product.findOne({
        name_aliment,
      });

      if (findAlimentByName) {
        return res.status(400).json({
          status: false,
          msg: "El alimento ya existe",
        });
      }

      let aliment = new Product();

      aliment.name_aliment = name_aliment;
      aliment.quantity_supplied = quantity_supplied;
      aliment.price_aliment = price_aliment;

      await aliment.save();
      return res.status(200).json({
        status: true,
        msg: "Alimento agregado exitosamente",
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: "Por favor hable con el administrador encargado",
      });
    }
  } else {
    res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const updateDiet = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { diet_name, description } = req.body;
    const dietId = req.params.id;

    const findDietByName = await Diet.findOne({
      diet_name,
    });

    if (findDietByName && findDietByName._id != dietId) {
      return res.status(400).json({
        status: "Error",
        msg: "Existe una dieta con este nombre.",
      });
    }

      await Diet.findByIdAndUpdate(
        { _id: dietId },
        {diet_name, description},
        (err) => {
          if (err) {
            res.status(400).json({
              status: false,
              msg: "Por favor hable con el administrador",
            });
          } else {
            res.status(200).send({
              status: true,
              msg: "Dieta actualizada con exito",
            });
          }
        }
      );
  } else {
    res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const updateAliment = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { name_aliment, quantity_supplied, price_aliment } = req.body;
    const alimentId = req.params.id;

    const findAlimentByName = await Product.findOne({
      name_aliment,
    });

    if (findAlimentByName && findAlimentByName._id != alimentId) {
      return res.status(400).json({
        status: "Error",
        msg: "Existe un alimento con este nombre.",
      });
    }

    await Product.findByIdAndUpdate(
      { _id: alimentId },
      { name_aliment, quantity_supplied, price_aliment },
      (err) => {
        if (err) {
          res.status(400).json({
            status: false,
            msg: "Por favor hable con el administrador",
          });
        } else {
          res.status(200).send({
            status: true,
            msg: "Alimento actualizado con exito",
          });
        }
      }
    );
  } else {
    res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const removeDiet = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    let dietId = req.params.id;

    /*let findDiet = await Animal.findOne({ diet: ObjectId(dietId) });

    if (findDiet) {
      return res.status(400).json({
        status: false,
        msg: "Esta dieta se encuentra en uso.",
      });
    }*/

    Diet.findOneAndDelete({ _id: dietId }, (err, diet) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: "Error al procesar la peticion",
        });
      }
      if (!diet) {
        return res.status(404).send({
          status: false,
          msg: "No se ha eliminado la dieta",
        });
      }
      return res.status(200).json({
        status: true,
        msg: "Dieta removida de forma exitosa",
      });
    });
  } else {
    return res.status(400).send({
      status: false,
      msg: "No puedes remover la dieta",
    });
  }
};

const deleteAliment = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    let alimentId = req.params.id;

    let findAliment = await Diet.findOne({ aliment: ObjectId(alimentId) });

    if (findAliment) {
      return res.status(400).json({
        status: false,
        msg: "Este alimento se encuentra en uso.",
      });
    }

    Diet.findOneAndDelete({ _id: alimentId }, (err, aliment) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: "Error al procesar la peticion",
        });
      }
      if (!aliment) {
        return res.status(404).send({
          status: false,
          msg: "No se ha eliminado el alimento",
        });
      }
      return res.status(200).json({
        status: true,
        msg: "Alimento eliminado de forma exitosa",
      });
    });
  } else {
    return res.status(400).send({
      status: false,
      msg: "No puedes eliminar el alimento",
    });
  }
};

const getDiets = async (req, res = response) => {
 const diets = await Diet.find().populate("animal aliment");
      

      return res.status(200).json({
        status: true,
        diets: diets,
      });
};

const getDietByAnimal = (res = response) => {
  const animal_id = req.params.id;

  Diet.find({ animal: ObjectId(animal_id) })
    .populate("animal")
    .sort({ name: 1 })
    .exec((err, diets) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: "Error al hacer la consulta",
        });
      }

      return res.status(200).json({
        status: true,
        diets: {
          diets: diets,
        },
      });
    });
};

const getAliments = async (req, res = response) => {
  const aliments = await Product.find();

  return res.status(200).json({
    status: true,
    aliments: aliments,
  });
};

module.exports = {
  save,
  addAliment,
  removeDiet,
  deleteAliment,
  getDiets,
  getDietByAnimal,
  getAliments,
  updateDiet,
  updateAliment,
};
