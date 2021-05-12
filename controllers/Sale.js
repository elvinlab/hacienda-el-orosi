const Sale = require("../models/Sale.js");
const Animal = require("../models/Animal.js");

const { response } = require("express");

const make = async ( req, res = response ) => {
    if( req.user.role =="Dueño" ){
        const { animal_id, price, priceKG, buyer_name, sale_type} = req.body;
        const animalId = req.params.weight;
       try{
        let sale = new Sale();

        sale.Animal = animal_id;
        sale.sale_type = sale_type;
        if(sale.sale_type === "subasta"){
         sale.price = price;
        }
        else{
        sale.priceKG = priceKG;
        sale.total_price = Math.floor(priceKG * animalId ); 
        }
        sale.buyer_name = buyer_name;
        await sale.save();

        return res.status(200).json({
            status: true,
            msg: "Venta realizada con éxito.",
            sale: sale,
          });

       }catch (error) {
        return res.status(500).json({
          status: false,
          msg: "Por favor contacte con un ING en Sistemas.",
        });
      }
    }else {
        res.status(500).json({
          status: false,
          msg: "No posees los privilegios necesarios en la plataforma.",
        });
      }
};

module.exports = {
    make,
};