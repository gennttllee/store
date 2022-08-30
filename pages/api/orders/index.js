import nextConnect from 'next-connect';
import { database } from '../../../utils/db'
import Order from '../../../models/Order'
import { isAuth } from '../../../utils/auth';
import Product from '../../../models/Product';


database();
const handler = nextConnect({})

handler.use(isAuth);

handler.post(async (req, res) => {
    try {
        const mainOrder = new Order({
            ...req.body,
            user: req.user._id
        });
        await mainOrder.save();
        for (const order of mainOrder.orderItems) {
            const myP = await Product.findOne({ _id: order._id });
            if (myP) {
                let newQuantity = myP.countInStock - order.quantity;
                await Product.updateOne({ _id: order._id }, { $set: { countInStock: newQuantity } })
            }
        };
        res.status(200).json(mainOrder)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

export default handler