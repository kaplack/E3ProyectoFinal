import fs from "fs";
import mongoose from "mongoose";
import CartModel from "../models/cart.js";

class ContenedorCart {
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
        console.log("DB Connected");
      }
    );
  }

  save(objeto) {
    this.connect();
    const cartModel = new CartModel(objeto);
    const cartSaved = cartModel.save();
    return cartSaved.userID;

    // try {
    //   const files = fs.readdirSync("./data");
    //   let data = fs.readFileSync(`./data/${this.nombre}`, "utf-8");

    //   if (files.some((file) => file == this.nombre) && data != "") {
    //     data = JSON.parse(data);
    //     let ids = data.map((value) => {
    //       return value.cartId;
    //     });
    //     const idn = parseInt(Math.max(...ids) + 1);
    //     console.log(idn);
    //     objeto = {
    //       cartId: idn,
    //       timeStamp: Date.now(),
    //       productos: objeto ? [{ ...objeto }] : [],
    //     };
    //     data.push(objeto);
    //     data = JSON.stringify(data);

    //     fs.writeFileSync(`./data/${this.nombre}`, data, "utf-8");

    //     console.log("si existe");
    //     return objeto;
    //   } else {
    //     objeto = {
    //       cartId: this.id,
    //       timeStamp: Date.now(),
    //       productos: objeto ? [{ ...objeto }] : [],
    //     };
    //     objeto = JSON.stringify(Array(objeto));
    //     fs.writeFileSync(`./data/${this.nombre}`, objeto, "utf-8");
    //     console.log("el archivo se creo");
    //     return objeto;
    //   }
    // } catch (error) {
    //   console.log(error, "hubo un error");
    // }
  }

  async read() {
    const connect = await this.connect();

    let cart = await CartModel.find({});
    return cart;
  }
}

export default ContenedorCart;

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
