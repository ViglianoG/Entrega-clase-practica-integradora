import { Router } from "express";
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";

const router = Router();

//RUTA RAIZ POST CREA UN NUEVO CARRITO
router.post("/", async (req, res) => {
  try {
    const result = await cartModel.create([]);
    res.json({ result: "Success", payload: result });
  } catch (error) {
    console.log(error);
    res.json({ result: "Error...", error });
  }
});

//LISTA LOS PRODUCTOS DEL CARRITO CON EL ID ESPECIFICADO
router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await cartModel.findOne({ _id: cid });

    res.json({ result: "Success", payload: result });
  } catch (error) {
    console.log(error);
    res.json({ result: "Error...", error });
  }
});

//AGREGA UN PRODUCTO O MODIFICA LA QUANTITY
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    const cart = await cartModel.findOne({ _id: cid });
    if (!cart)
      res.send({
        status: "ERROR",
        error: "No se ha encontrado el carrito especificado...",
      });

    const product = await productModel.findOne({ _id: pid });
    if (!product)
      res.send({
        status: "ERROR",
        error: "No se ha encontrado el producto especificado...",
      });

    const productIndex = cart.products.findIndex((p) =>
      p.product.equals(product._id)
    );
    if (productIndex === -1) {
      cart.products.push({ product: product._id, quantity: 1 });
      await cart.save();
    } else {
      cart.products[productIndex].quantity++;
      await cartModel.updateOne({ _id: cid }, cart);
    }

    res.json({ status: "success", payload: cart });
    
  } catch (error) {
    console.log(error);
    res.json({ result: "Error...", error });
  }
});

export default router;
