import nextConnect from 'next-connect';
import db from '../../../utils/db'
import Order from '../../../models/Order'
import {isAuth} from '../../../utils/auth';



const handler = nextConnect({})

handler.use(isAuth);

handler.post(async (req, res) => {
    await db.connect();
    const mainOrder = new Order({
        ...req.body,
        user : req.user._id
    });
    await mainOrder.save();
    await db.disconnect();
    res.send({mainOrder})
})


export default handler