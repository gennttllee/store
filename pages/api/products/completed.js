import nextConnect from 'next-connect';
import db from '../../../utils/db'
import Order from '../../../models/Order'
import { isAuth } from '../../../utils/auth';
import Product from '../../../models/Product';

const handler = nextConnect({})

handler.use(isAuth);

handler.post(async (req, res) => {
    await db.connect();
    const mainOrder = new Order({
        ...req.body,
        user: req.user._id
    });
    await mainOrder.save();
    for (const order of mainOrder.orderItems){
        const myP = await Product.findOne({ _id: order._id });
        let newQuantity = myP.countInStock - order.quantity;
        await Product.updateOne({ _id: order._id }, { $set: { countInStock: newQuantity } })
    };
    await db.disconnect();
    return res.send ({mainOrder})
})

export default handler