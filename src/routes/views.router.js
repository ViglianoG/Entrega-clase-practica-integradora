import { Router } from "express";
import productModel from "../dao/models/product.model.js";

const router = Router();

//VER PRODUCTOS AGREGADOS
router.get("/", async (req, res) => {
  try {
    const products = await productModel.find().lean().exec();

    const QLimit = req.query.limit;
    if (QLimit) products.splice(QLimit);

    res.render("home", { products, style: "index.css" });
  } catch (error) {
    console.log(error);
    res.json({ result: "Error...", error });
  }
});

//VER PROD POR ID
router.get("/:pid", async (req, res) => {
  try {
    const pID = req.params.pid;
    const product = await productModel.findOne({ _id: pID }).lean().exec();

    res.render("oneProduct", { product });
  } catch (error) {
    console.log(error);
    res.json({ result: "Error...", error });
  }
});

//AGREGAR PROD
router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const newProduct = new productModel(product);
    await newProduct.save();

    res.redirect("/" + newProduct._id);
  } catch (error) {
    console.log(error);
    res.json({ result: "Error...", error });
  }
});

//ELIMINAR PROD
router.delete("/delete/:pid", async (req, res) => {
  try {
    const pID = req.params.pid;
    await productModel.deleteOne({ _id: pID });

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.json({ result: "Error...", error });
  }
});

//FORMULARIO PARA CREAR PRODS
router.get("/create", async (req, res) => {
  res.render("create", {});
});

export default router;
