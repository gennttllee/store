import nextConnect from 'next-connect';
import db from '../../../utils/db'
import Order from '../../../models/Order'


const handler = nextConnect()

handler.post(async (req, res) => {
    await db.connect();
    await Order.deleteOne({_id : req.body.order._id});
    await db.disconnect()
    res.send('successful')
})



export default handler