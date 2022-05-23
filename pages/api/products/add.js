import nextConnect from 'next-connect';
import db from '../../../utils/db'
import Product from '../../../models/Product'
import multer, { diskStorage } from 'multer';

const handler = nextConnect()

const upload = multer({
    storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
});

let uploadFile = upload.single('picture')

handler.use(uploadFile);

handler.post(async (req, res) => {
    try{
        await db.connect();
        const respect = await new Product({
            ...req.body,
            image: `/uploads/${req.file.filename}`
        });
        await respect.save();
        await db.disconnect();
        res.send('success')
    } catch (err){
        res.send(err.message)
    }
})

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler