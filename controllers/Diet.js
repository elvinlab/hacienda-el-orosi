const Diet = require("../models/Diet.js");
const Product = require("../models/Product.js");

const { response } = require("express");
const Aliment = require("../models/Aliment.js");

const save = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { diet_name, description} = req.body;


      let diet = new Diet();

      diet.diet_name = diet_name;
      diet.description = description;

      await diet.save();

      return res.status(200).json({
        status: true,
        msg: "Dieta registrada con éxito.",
        diet: diet,
      });

    
  } else {
    return res.status(400).send({
      status: false,
      msg: "No se puede registrar la dieta.",
    });
  }
};

const addAliment = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { diet_id, product_id, quantity_supplied } = req.body;

    try {
      let aliment = new Aliment();

      aliment.diet_id = diet_id;
      aliment.quantity_supplied = quantity_supplied;
      aliment.product_id = product_id;


      await aliment.save();

      return res.status(200).json({
        status: true,
        msg: "Alimento agregado con éxito.",
        aliment: aliment,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: "Por favor contacté con un ING en Sistemas para más información.",
      });
    }
  } else {
    res.status(500).json({
      status: false,
      msg: "No posees los privilegios necesarios en la plataforma.",
    });
  }
};

const updateDiet = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { diet_name, description, animal} = req.body;
    const dietId = req.params.id;

    const findDietByName = await Diet.findOne({
      diet_name,
    });

    if (findDietByName && findDietByName._id != dietId) {
      return res.status(400).json({
        status: "Error",
        msg: "El nombre de esta dieta ya se encuentra registrado.",
      });
    }

      await Diet.findByIdAndUpdate(
        { _id: dietId },
        {diet_name, description, animal},
        (err) => {
          if (err) {
            res.status(400).json({
              status: false,
              msg: "Por favor contacté con un ING en Sistemas para más información.",
            });
          } else {
            res.status(200).send({
              status: true,
              msg: "Dieta actualizada con éxito",
            });
          }
        }
      );
  } else {
    res.status(500).json({
      status: false,
      msg: "No posees los privilegios necesarios en la plataforma.",
    });
  }
};

const updateAliment = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { name_aliment, quantity_supplied, aliment_kg, price_aliment } = req.body;
    const alimentId = req.params.id;

    const findAlimentByName = await Product.findOne({
      name_aliment,
    });

    if (findAlimentByName && findAlimentByName._id != alimentId) {
      return res.status(400).json({
        status: "Error",
        msg: "El nombre del alimento ya se encuentra registrado.",
      });
    }

    await Product.findByIdAndUpdate(
      { _id: alimentId },
      { name_aliment, quantity_supplied, aliment_kg, price_aliment },
      (err) => {
        if (err) {
          res.status(400).json({
            status: false,
            msg: "Por favor contacté con un ING en Sistemas para más información.",
          });
        } else {
          res.status(200).send({
            status: true,
            msg: "Alimento actualizado con éxito.",
          });
        }
      }
    );
  } else {
    res.status(500).json({
      status: false,
      msg: "No posees los privilegios necesarios en la plataforma.",
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
          msg: "Error al procesar la peticion.",
        });
      }
      if (!diet) {
        return res.status(404).send({
          status: false,
          msg: "No se logro eliminar la dieta.",
        });
      }
      return res.status(200).json({
        status: true,
        msg: "Dieta removida con éxito.",
      });
    });
  } else {
    return res.status(400).send({
      status: false,
      msg: "No se puede remover la dieta.",
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
          msg: "Error al procesar la peticion.",
        });
      }
      if (!aliment) {
        return res.status(404).send({
          status: false,
          msg: "No se logro eliminar el alimento.",
        });
      }
      return res.status(200).json({
        status: true,
        msg: "Alimento eliminado de forma exitosa.",
      });
    });
  } else {
    return res.status(400).send({
      status: false,
      msg: "No se puede eliminar este alimento",
    });
  }
};

const getDiets = async (req, res = response) => {
 const diets = await Diet.find();
      

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
    populate: "diet product",
  };
  Aliment.paginate({}, options, (err,aliments) => {
    if (err) {
      return res.status(500).send({
        status: false,
        msg: "Error al hacer la consulta",
      });
    }
    return res.status(200).json({
      status: true,
      aliments: {
        aliments: aliments.docs,
        count: aliments.count,
      }
    });
  })

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
