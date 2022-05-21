import bcrypt from "bcryptjs";
import nc from "next-connect";
import User from '../../../models/User'
import db from "../../../utils/db";


const handler = nc();

handler.post(async (req, res) => {
    await db.connect();
    await User.updateOne({email : req.body.email}, {$set : {password : bcrypt.hashSync(req.body.password)}})
    await db.disconnect();
    res.send('success')
});

export default handler;