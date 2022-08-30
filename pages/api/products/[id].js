import nc from "next-connect";
import Product from "../../../models/Product";
import {database} from "../../../utils/db";

database();
const handler = nc();

handler.get(async (req, res) => {
    try {
        const product = await Product.findById(req.query._id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error.message)
    }
});


handler.delete(async (req, res) => {
    try {
        await Product.deleteOne({ _id: req.query.id });
        res.status(200).json(req.query.id);
    } catch (error) {
        res.statusCode(500).json(error.message)
    }
})

export default handler;