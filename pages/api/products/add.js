import nextConnect from 'next-connect';
import db from '../../../utils/db'
import Product from '../../../models/Product'

const handler = nextConnect()

handler.post(async (req, res) => {
    await db.connect();
    const respect = await new Product({
        ...req.body,
    });
    console.log(respect)
    await respect.save();
    await db.disconnect();
    res.send('success')
})

export default handler