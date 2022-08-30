import nc from "next-connect";
import Product from "../../../models/Product";
import {database} from "../../../utils/db";

database();
const handler = nc();

handler.get(async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error.message)
    }
});

handler.post(async (req, res) => {
    try {
        const newProduct = await new Product({...req.body });
        await newProduct.save();
        res.status(200).json(newProduct);
    } catch (error) {
        res.status(500).json(error.message)
    }
})

export default handler;