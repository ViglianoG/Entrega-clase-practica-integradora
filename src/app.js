import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import run from "./run.js";

const port = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.use(express.static(__dirname + "/public"));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const uri =
  "mongodb+srv://GVigliano:ljJ5SrK15NEK9EuA@ecommerce.qtnsooy.mongodb.net/?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose.connect(
  uri,
  {
    dbName: "ecommerce",
  },
  (error) => {
    if (!error) {
      console.log("DB Connected..");
      const httpServer = app.listen(port, () =>
        console.log(`Listening on port: ${port}`)
      );
      const socketServer = new Server(httpServer);
      httpServer.on("error", (e) => console.log("ERROR: " + e));

      run(socketServer, app);
    } else {
      console.log("Can't connect to db..");
    }
  }
);
