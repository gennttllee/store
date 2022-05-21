import nextConnect from 'next-connect';
import db from '../../../utils/db'
import Product from '../../../models/Product'


const handler = nextConnect()

handler.post(async (req, res) => {
    await db.connect();
    await Product.deleteOne({_id : req.body.product._id});
    await db.disconnect()
    res.send('successful')
})



export default handler