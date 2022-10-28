import multer from "multer";
import ContenedorUser from "../classes/ContenedorUser.js";
import ContenedorCart from "../classes/ContenedorCart.js";
import { createTransport } from "nodemailer";
import twilio from "twilio";

import { Router } from "express";

const users = new ContenedorUser();
const carts = new ContenedorCart();

const routerCart = Router();

routerCart.get("/", async (req, res) => {
  let cartData = await carts.read();

  console.log(userCart);

  res.send(cartData);
});

const upload = multer();
routerCart.post("/", upload.none(), async (req, res) => {
  let cartItem = {
    timeStamp: Date.now(),
    userID: req.body.userID,
    items: req.body.items,
  };

  const newCart = carts.save(cartItem);

  let usersData = await users.read();
  let userCart = usersData.filter((uc) => uc._id == req.body.userID);

  //mail config
  const mail = process.env.CORREO_ADM;
  const passw = process.env.PASS;
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: mail,
      pass: passw,
    },
  });
  //send mail to Admin
  transporter.sendMail({
    from: mail,
    //voy a enviar el correo a mi propio correo
    to: [mail],
    subject: "Coloso - Agrego producto a Carrito",
    html: `
    <h1>Nuevo producto a Carrito<h1>
    <p>el usuario ${userCart[0].username} agrego un articulo.</p>
  `,
  });

  //envio mensaje whatsapp
  // twilio palabra clave es join choice-fish
  const accountSID = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;

  const client = twilio(accountSID, authToken);
  client.messages
    .create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP}`,
      to: `whatsapp:${process.env.ADMIN_WHATSAPP}`,
      body: `Hola, el usuario ${userCart[0].username} agrego un articulo.`,
    })
    .then((message) => console.log(message))
    .catch((e) => console.log(e));

  const sms = twilio(accountSID, authToken);
  sms.messages
    .create({
      body: `Usuario ${userCart[0].username} agrego un articulo al carrito.`,
      from: process.env.SMS_PHONE,
      to: userCart[0].phone,
    })
    .then((r) => console.log(r))
    .catch((e) => console.error(e));

  res.send(newCart);
});

export default routerCart;
