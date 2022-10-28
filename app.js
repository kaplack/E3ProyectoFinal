import cluster from "cluster";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import routerProduct from "./router/products.router.js";
import routerProductTest from "./router/productsTest.router.js";
import routerLogin from "./router/login.router.js";
import routerSignUp from "./router/signUp.router.js";
import routerCart from "./router/cart.router.js";
import ContenedorChat from "./classes/ContenedorChatFile.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import ContenedorUser from "./classes/ContenedorUser.js";
import bcryptjs from "bcryptjs";
import parseArgv from "minimist";
import * as dotenv from "dotenv";
import routerRandom from "./router/random.router.js";
import os from "os";
import multer from "multer";

dotenv.config();
console.log("hola", parseArgv(process.argv));
//const PORT = parseArgv(process.argv).port || 8080;

// lo puedes correr con --> node app.js 7000
const modeCluster = parseArgv(process.argv).modo || "fork";

if (modeCluster == "cluster" && cluster.isMaster) {
  const numCPUs = os.cpus().length;

  console.log("numCPUs:", numCPUs);
  console.log("PID master:", process.pid);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log("Died!");
  });
} else {
  const app = express();

  const server = http.createServer(app);
  const io = new Server(server);

  app.use(express.json());
  const db = new ContenedorChat("./public/db/dbNormalized.json");
  const myMongoDB = new ContenedorUser();
  //Template Engines

  //CONFIGURACION EXPRESS-SESSION
  // mongodb
  app.use(cookieParser());
  app.use(
    session({
      store: new MongoStore({
        mongoUrl: process.env.MONGO_URL,
        advancedOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
        ttl: 60000,
      }),
      secret: "orwell",
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(express.urlencoded({ extended: true }));
  app.use("/api/uploads", express.static("uploads"));
  app.use("/public", express.static("public"));

  app.set("view engine", "ejs");
  app.set("views", "./views");

  app.get("/", async (req, res) => {
    let user = req.session.currentUser;
    let usersData = await myMongoDB.read();
    let currUser = usersData.filter((u) => u.username == user);
    res.render("main", {
      user: currUser[0],
      PORT: parseArgv(process.argv).port,
    });
  });

  app.use("/api/productos", routerProduct);
  app.use("/api/productos-test", routerProductTest);
  app.use("/api/randoms", routerRandom);

  //LOGIN
  app.use("/login", routerLogin);
  //LOGIN
  app.use("/chat", (req, res) => {
    //db.myDenormalized();
    res.render("index");
  });

  //LOG OUT (el header.ejs envia un post al localhost/logout)
  app.post("/logout", (req, res) => {
    let user = req.session.currentUser;
    req.session.destroy();
    res.send(`<h1>Hasta luego ${user} </h1>`);
  });

  //SIGNUP
  app.use("/signup", routerSignUp);

  app.get("/info", (req, res) => {
    res.send({
      inputArg: process.argv[0],
      platformName: process.platform,
      nodeVersion: process.version,
      totalMemory: process.memoryUsage,
      execPath: process.execPath,
      processID: process.pid,
      projectFolder: process.cwd(),
    });
  });

  app.use("/cart", routerCart);

  io.on("connection", (socket) => {
    console.log("Somebody connected!");

    socket.on("chat-in", (data) => {
      const date = new Date().toLocaleTimeString();
      const dataOut = {
        text: data.text,
        author: data.author,
        date,
      };
      // Guardar en DB
      db.save(dataOut);
      db.normalizarChat();

      console.log(dataOut);
      io.sockets.emit("chat-out", dataOut);
    });
  });

  let PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log("Running..." + PORT, " pid: " + process.pid);
  });
}

// en node corre con:
// node app.js --port 8082 --modo cluster
// result...
// {
//   _: [
//     'C:\\Program Files\\nodejs\\node.exe',
//     'C:\\Users\\ahbb2\\OneDrive\\Documentos\\CODERHOUSE\\BACKEND_coderhouse\\BackEnd\\D13ServidorBalance\\app.js'
//   ],
//   port: 8082,
//   modo: 'cluster'
// }

// en pm2
// pm2 start app.js --name="server" -- --port=8082 --modo=cluster
