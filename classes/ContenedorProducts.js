import mongoose from "mongoose";
import ProductModel from "../models/product.js";
import log4js from "log4js";

const logger = log4js.getLogger();

class ContenedorProducts {
  constructor() {
    this.url =
      "mongodb+srv://ABurga:g5kNcaBKcEodAE83@cluster0.4upmc2o.mongodb.net/?retryWrites=true&w=majority";
  }

  connect() {
    const connect = mongoose.connect(
      this.url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
        logger.info("DB Connected");
      }
    );
  }

  save(objeto) {
    this.connect();
    const productModel = new ProductModel(objeto);
    const productSaved = productModel.save();
    return productSaved;
  }

  async read() {
    const connect = await this.connect();

    let products = await ProductModel.find({});
    return products;
  }
}

export default ContenedorProducts;

// saveProduct(cart, product) {
//   try {
//     const files = fs.readdirSync("./data");
//     let data = fs.readFileSync(`./data/${this.nombre}`, "utf-8");

//     const cartList = JSON.parse(data);
//     const newCartList = cartList.map((item) => {
//       if (item.cartId == cart) {
//         let prods = item.productos;
//         item.productos.push(product[0]);
//       }
//       return item;
//     });

//     data = JSON.stringify(newCartList);

//     fs.writeFileSync(`./data/${this.nombre}`, data, "utf-8");
//     return newCartList;
//   } catch {}
// }

// getById(Number) {
//   //Solo lo usa para obtener el producto de un carrito
//   try {
//     let data = fs.readFileSync(`./data/${this.nombre}`, "utf-8");
//     data = JSON.parse(data);
//     const idData = data.filter((item) => item.cartId == Number);
//     if (idData.length > 0) {
//       return idData[0].productos;
//     } else {
//       const error = { error: "Producto no encontrado" };
//       return error;
//     }
//   } catch (error) {
//     console.log("hay un problema");
//   }
// }

// updateById(id, objeto) {
//   try {
//     let data = fs.readFileSync(`./data/${this.nombre}`, "utf-8");
//     data = JSON.parse(data);
//     let idData = data.filter((item) => item.id == id);
//     data = data.filter((item) => item.id != id);
//     if (idData.length > 0) {
//       const { title, price } = objeto;
//       idData = {
//         ...idData[0],
//         title,
//         price,
//       };

//       data.push(idData);
//       data = JSON.stringify(data);
//       fs.writeFileSync(`./data/${this.nombre}`, data, "utf-8");
//       console.log("ok");
//     } else {
//       const error = { error: "Producto no encontrado" };
//       return error;
//     }
//   } catch (error) {
//     console.log("hay un problema", error);
//   }
// }

// getAll() {
//   try {
//     let data = fs.readFileSync(`./data/${this.nombre}`, "utf-8");
//     data = JSON.parse(data);
//     return data;
//   } catch (error) {
//     console.log("hay un problema");
//   }
// }

// deleteById(Number) {
//   try {
//     let data = fs.readFileSync(`./data/${this.nombre}`, "utf-8");
//     data = JSON.parse(data);
//     let idData = data.filter((item) => item.cartId != Number);
//     idData = JSON.stringify(idData);
//     fs.writeFileSync(`./data/${this.nombre}`, idData, "utf-8");
//     return idData;
//   } catch (error) {
//     console.log("hay un problema");
//   }
// }

// deleteCartItem(cart_Id, item_Id) {
//   let data = fs.readFileSync(`./data/${this.nombre}`, "utf-8");
//   data = JSON.parse(data);
//   let cartDetail = data.filter((item) => item.cartId == cart_Id);
//   let cartDif = data.filter((item) => item.cartId != cart_Id);

//   let prods = cartDetail[0].productos;
//   prods = prods.filter((item) => item.id != item_Id);
//   cartDetail = {
//     ...cartDetail[0],
//     productos: prods,
//   };
//   cartDif.push(cartDetail);
//   let newCar = JSON.stringify(cartDif);
//   fs.writeFileSync(`./data/${this.nombre}`, newCar, "utf-8");
// }

// deleteAll() {
//   fs.writeFileSync(`./data/${this.nombre}`, "", "utf-8");
// }
