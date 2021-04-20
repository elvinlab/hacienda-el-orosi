const Animal = require("../models/Animal.js");
const Type = require("../models/Type.js");
const moment = require("moment");
const AWS = require("aws-sdk");
const { uuid } = require("uuidv4");

const { ObjectId } = require("mongodb");
const { response } = require("express");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const saveAnimalType = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const administratorID = req.user.id;
    const { name, gender } = req.body;

    try {
      let findTypeByName = await Type.findOne({ name });

      if (findTypeByName) {
        return res.status(400).json({
          status: false,
          msg: `El tipo de animal con nombre ${name} ya existe`,
        });
      }

      const type = new Type();
      type.administrator = administratorID;
      type.name = name;
      type.gender = gender;

      await type.save();

      return res.status(200).json({
        status: true,
        msg: `El tipo de animal con nombre ${name} fue registrado con exito`,
        type: type,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        msg: "Porfavor contacte con el Administrador para mas información",
      });
    }
  } else {
    return res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const getTypes = async (req, res = response) => {
  const types = await Type.find().sort({ create_at: -1 });

  return res.status(200).json({
    status: true,
    types: types,
  });
};

const removeType = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Recursos Humanos") {
    let typeID = req.params.id;

    const findTypeByID = await Animal.findOne({ type: ObjectId(typeID) });
    if (findTypeByID) {
      return res.status(404).send({
        status: false,
        msg:
          "Este tipo de animal se encuentra actualmente signado en algun animal",
      });
    }

    const findAllType = await Type.find();

    if (findAllType.length === 1) {
      return res.status(404).send({
        status: false,
        msg: "No se puede estar sin tipos de animales",
      });
    }

    Type.findOneAndDelete({ _id: typeID }, (err, type) => {
      if (err) {
        return res.status(500).send({
          status: false,
          msg: "Error al procesar la peticion",
        });
      }
      if (!type) {
        return res.status(404).send({
          status: false,
          msg: "No se ha eliminado el tipo de animal",
        });
      }
      return res.status(200).json({
        status: true,
        msg: "Tipo de animal removido de forma exitosa",
        type: type,
      });
    });
  } else {
    return res.status(400).send({
      status: false,
      msg: "No puedes remover el tipo de animal",
    });
  }
};

const register = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const administratorID = req.user.id;
    const {
      plate_number,
      plate_color,
      type_animal,
      status,
      race,
      age,
      date_admission,
      daughter_of,
      starting_weight,
      place_origin,
      name,
      next_due_date,
    } = req.body;

    let findAnimalByPlateNumber = await Animal.findOne({
      plate_number,
    });

    if (findAnimalByPlateNumber) {
      return res.status(400).json({
        status: false,
        msg: `El animal con numero de chapa ${plate_number} ya existe`,
      });
    }

    let animal = new Animal();

    animal.administrator = administratorID;
    animal.plate_number = plate_number;
    animal.plate_color = plate_color;
    animal.type = type_animal;
    animal.status = status;
    animal.race = race;
    animal.age = age;
    animal.date_admission = moment(date_admission).format("YYYY-MM-DD");
    animal.daughter_of = daughter_of;
    animal.starting_weight = starting_weight;
    animal.place_origin = place_origin;
    animal.name = name;
    animal.next_due_date =
      next_due_date && moment(next_due_date).format("YYYY-MM-DD");

    await animal.save();

    const animalFind = await Animal.findById(ObjectId(animal._id))
      .populate("daughter_of type")
      .sort({ date_admission: -1 });

    return res.status(200).json({
      status: true,
      msg: `El animal con numero de chapa ${plate_number} fue registrado con exito`,
      animal: animalFind,
    });
  } else {
    return res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const update = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const animalID = req.params.id;
    const {
      plate_number,
      plate_color,
      type_animal,
      status,
      race,
      age,
      date_admission,
      daughter_of,
      starting_weight,
      place_origin,
      name,
      next_due_date,
    } = req.body;

    const findAnimalByPlateNumber = await Animal.findOne({
      plate_number,
    });

    if (findAnimalByPlateNumber && findAnimalByPlateNumber._id != animalID) {
      return res.status(400).json({
        status: false,
        msg: "Ya existe un animal con este numero de chapa.",
      });
    }

    Animal.findByIdAndUpdate(
      { _id: animalID },
      {
        plate_number,
        plate_color,
        type: type_animal,
        status,
        race,
        age,
        date_admission: moment(date_admission).format("YYYY-MM-DD"),
        daughter_of,
        starting_weight,
        place_origin,
        name,
        next_due_date,
      },
      { new: true },
      (err, animal) => {
        if (err) {
          res.status(400).json({
            status: false,
            msg:
              "Por favor contacte con un ingeniero en sistemas para mas información",
          });
        } else {
          res.status(200).send({
            status: true,
            msg: "Datos del animal actualizados con exito",
            animal: animal,
          });
        }
      }
    ).populate("daughter_of type");
  } else {
    res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const changeStatus = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { status } = req.body;
    const animalID = req.params.id;

    await Animal.findByIdAndUpdate(
      { _id: animalID },
      { status: status },
      { new: true },
      (err, animal) => {
        if (err) {
          res.status(400).json({
            status: false,
            msg:
              "Por favor contacte con un ingeniero en sistemas para mas información",
          });
        } else {
          res.status(200).send({
            status: true,
            msg: "Estado actualizado del animal",
            animal: animal,
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

const changeNextDueDate = async (req, res = response) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    const { next_due_date } = req.body;
    const animalID = req.params.id;

    await Animal.findByIdAndUpdate(
      { _id: animalID },
      { next_due_date },
      { new: true },
      (err, animal) => {
        if (err) {
          return res.status(400).json({
            status: false,
            msg:
              "Por favor contacte con un ingeniero en sistemas para mas información",
          });
        } else {
          return res.status(200).send({
            status: true,
            msg: "Fecha proxima del parto actualizada",
            animal: animal,
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

const getAnimals = async (req, res = response) => {
  const animals = await Animal.find()
    .populate("daughter_of type")
    .sort({ date_admission: -1 });

  return res.status(200).json({
    status: true,
    animals: animals,
  });
};

const getAnimalByType = async (req, res = response) => {
  let typeID = req.params.type;

  if (!typeID) {
    return res.status(400).json({
      status: false,
      msg: "Problemas en la consulta",
    });
  } else {
  }
  const animals = await Animal.find({ type: ObjectId(typeID) })
    .populate("daughter_of type")
    .sort({ date_admission: -1 });

  return res.status(200).json({
    status: true,
    animals: animals,
  });
};

const getAnimal = async (req, res = response) => {
  let plate_number = req.params.id;

  await Animal.findOne({ plate_number })
    .populate("daughter_of type")
    .exec((err, animal) => {
      if (err || !animal) {
        return res.status(404).send({
          status: false,
          msg: "Animal no existe",
        });
      }

      return res.status(200).send({
        msg: "Se encontro con exito",
        status: true,
        animal: animal,
      });
    });
};

const getAnimalByStatusAndType = async (req, res = response) => {
  let typeID = req.params.type;
  let status = req.params.status;

  const animals = await Animal.find({ type: ObjectId(typeID), status: status })
    .populate(" daughter_of type")
    .sort({ date_admission: -1 });

  return res.status(200).json({
    status: true,
    animals: animals,
  });
};

const uploadImgProfile = (req, res) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    let animalID = req.params.id;

    if (!req.file || !animalID) {
      return res.status(400).send({
        status: false,
        msg: "Imagen del registro no subida...",
      });
    }

    let myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];

    if (
      fileType != "png" &&
      fileType != "jpg" &&
      fileType != "jpeg" &&
      fileType != "gif"
    ) {
      return res.status(200).send({
        status: false,
        msg: "La extension del archivo no es valida.",
      });
    }

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${uuid()}.${fileType}`,
      Body: req.file.buffer,
    };

    s3.upload(params, (error, data) => {
      if (error) {
        res.status(500).send(error);
      }

      Animal.findOneAndUpdate(
        { _id: animalID },
        { photo_link: data.Location },
        { new: true },
        (err, animal) => {
          if (err || !animal) {
            return res.status(500).send({
              status: "error",
              msg: "Error al guardar el registro",
            });
          }

          return res.status(200).send({
            status: "success",
            msg: "Datos actualizados en el registro",
            animal: animal,
          });
        }
      ).populate(" daughter_of type");
    });
  } else {
    res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

const uploadImgReg = (req, res) => {
  if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
    let animalID = req.params.id;

    if (!req.file || !animalID) {
      return res.status(400).send({
        status: false,
        msg: "Imagen del registro no subida...",
      });
    }

    let myFile = req.file.originalname.split(".");
    const fileType = myFile[myFile.length - 1];

    if (
      fileType != "png" &&
      fileType != "jpg" &&
      fileType != "jpeg" &&
      fileType != "gif"
    ) {
      return res.status(200).send({
        status: false,
        msg: "La extension del archivo no es valida.",
      });
    }

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${uuid()}.${fileType}`,
      Body: req.file.buffer,
    };

    s3.upload(params, (error, data) => {
      if (error) {
        res.status(500).send(error);
      }

      Animal.findOneAndUpdate(
        { _id: animalID },
        { photo_register: data.Location },
        { new: true },
        (err, animal) => {
          if (err || !animal) {
            return res.status(500).send({
              status: "error",
              msg: "Error al guardar el registro",
            });
          }

          return res.status(200).send({
            status: "success",
            msg: "Datos actualizados en el registro",
            animal: animal,
          });
        }
      ).populate(" daughter_of type");
    });
  } else {
    res.status(500).json({
      status: false,
      msg: "No tienes permisos en la plataforma",
    });
  }
};

module.exports = {
  saveAnimalType,
  getTypes,
  removeType,
  register,
  update,
  changeStatus,
  changeNextDueDate,
  getAnimals,
  getAnimal,
  getAnimalByType,
  getAnimalByStatusAndType,
  uploadImgProfile,
  uploadImgReg,
};
