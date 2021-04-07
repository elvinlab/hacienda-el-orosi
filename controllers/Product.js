const Product = require("../models/Product.js");

const { ObjectId } = require("mongodb");
const { response } = require("express");

const save = async (req, res = response) => {
    if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
        const { name, kilograms, liters, price } = req.body;

        try {

            let product = new Product();

            product.name = name;
            product.kilograms = kilograms;
            product.liters = liters;
            product.price = price;

            await product.save();

            return res.status(200).json({
                status: true,
                msg: "producto registrado con exito",
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
            msg: "No tiene permisos en la plataforma",
        });
    }
};


const update = async (req, res = response) => {
    if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {
        const productID = req.params.id;
        const { name_product, kilograms, liters, price_product } = req.body;

        try {

            let dateTime = new Date();

            const findproductByName = await Product.findOne({ name_product });

            if (findproductByName && findproductByName._id != productID) {
                return res.status(400).json({
                    status: "Error",
                    msg: "Existe un producto con este nombre.",
                });
            }

            Product.findByIdAndUpdate(
                { _id: productID },
                {
                    name_product,
                    kilograms,
                    liters,
                    price_product,
                    updatedAt =  moment(dateTime).format("YYYY-MM-DD")
                },
                { new: true },
                (err, product) => {
                    if (err) {
                        return res.status(400).json({
                            status: false,
                            msg: "Por favor hable con un ingeniero en sistemas",
                        });
                    } else {
                        return res.status(200).send({
                            status: true,
                            msg: "Datos del producto actualziado",
                            product: product
                        });
                    }
                }
            );


        } catch (error) {
            return res.status(500).json({
                status: false,
                msg: "Por favor contacte con el administrador para más imformación",
            });
        }

    } else {
        return res.status(400).send({
            status: false,
            msg: "No tiene permisos en la plataforma",
        });
    }
}

const getProducts = async (req, res = response) => {
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
  };

  Product.paginate({}, options, (err, products) => {
    if (err) {
      return res.status(500).send({
        status: false,
        msg: "Error al hacer la consulta",
      });
    }

    return res.status(200).json({
      status: true,
      products: {
        products: products.docs,
        count: products.totalDocs,
      },
    });
  });
  };

const remove = async (req, res = response) => {
    if (req.user.role === "Dueño" || req.user.role === "Encargado del ganado") {

        const productID = req.params.id;

        if (await Diet.findOne({ product: ObjectId(productID) })) {
        } else {
            return res.status(400).send({
                status: false,
                msg: "No se puede eliminar ya que este producto esta siendo utilizado por una dieta en este momento",
            });

        }

        const productRemove = await Product.findByIdAndRemove({ productID });

        if (!productRemove) {

            return res.status(400).send({
                status: false,
                msg: "Ocurrio un error al eliminar el producto de la base de datos",
            });
        }

        return res.status(200).send({
            status: true,
            msg: "producto se elimino con exito",
            product: productRemove
        });

    } else {
        return res.status(400).send({
            status: false,
            msg: "No tiene permisos en la plataforma",
        });
    }
}

module.exports = {
    save,
    update,
    getProducts,
    remove
};
