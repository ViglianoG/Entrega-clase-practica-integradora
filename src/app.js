import express from "express";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from "./routes/cartsRouter.js";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import chatRouter from "./routes/chat.router.js";
import http from "http";

const app = express();
const port = 8080;
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/chat", chatRouter);

mongoose.set('strictQuery', false)
mongoose.connect(
  "mongodb+srv://GVigliano:ljJ5SrK15NEK9EuA@ecommerce.qtnsooy.mongodb.net/?retryWrites=true&w=majority",
  {
    dbName: "ecommerce",
  },
  (error) => {
    if (!error) {
      console.log("DB Connected..");
      app.listen(port, () => {
        console.log("Running...");
      });
    } else {
      console.log("Can't connect to db..");
    }
  }
);

export default io;
