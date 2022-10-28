import multer from "multer";
import ContenedorUser from "../classes/ContenedorUser.js";
import bcryptjs from "bcryptjs";
import { createTransport } from "nodemailer";

import { Router } from "express";

const users = new ContenedorUser();

const routerSignUp = Router();

routerSignUp.get("/", (req, res) => {
  res.render("signup", { user: req.session.currentUser });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

routerSignUp.post("/", upload.single("avatarFile"), async (req, res) => {
  let usersData = await users.read();
  let userCtrl = usersData.some((u) => u.username == req.body.user);
  const avFile = req.file;
  console.log(avFile);
  if (!userCtrl) {
    let password = req.body.password;
    let salt = bcryptjs.genSaltSync(8);
    password = bcryptjs.hashSync(String(password), salt);

    let userData = {
      username: req.body.user,
      email: req.body.email,
      age: req.body.age,
      address: req.body.address,
      phone: req.body.phone,
      avatar: avFile.path,
      password,
    };
    users.save(userData);

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
      subject: "Coloso - Registro de usuario nuevo",
      html: `
        <h1>Nuevo Usuario<h1>
        <p>el usuario ${req.body.user} se registro en Coloso.</p>
      `,
    });
    //send mail to new user
    transporter.sendMail({
      from: mail,
      to: [req.body.mail],
      subject: "Bienvenido a Coloso",
      html: `
        <h1>Bienvenido<h1>
        <p>Bienvenido a Coloso ${req.body.user}. Disfruta de nuestra plataforma.</p>
      `,
    });

    res.redirect("/");
  } else {
    res.send("El nombre de usuario ya existe!");
  }
});

export default routerSignUp;
