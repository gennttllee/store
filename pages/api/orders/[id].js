import nextConnect from 'next-connect';
import {database} from '../../../utils/db'
import Order from '../../../models/Order'

database();
const handler = nextConnect()

handler.delete(async (req, res) => {
    console.log(req.query)
    try {
        await Order.deleteOne({ _id: req.query.id });
        res.status(200).json(req.query.id)
    } catch (error) {
        res.status(500).json(error.message)
    }
})


export default handler