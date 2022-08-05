import bcrypt from "bcryptjs";
import nc from "next-connect";
import User from '../../../models/User'
import db from "../../../utils/db";
import { signToken } from "../../../utils/auth";

const handler = nc();

handler.post(async (req, res) => {
    try {
        await db.connect();
        const user = await User.updateOne({ email: req.body.email }, { $set: { password: bcrypt.hashSync(req.body.password) } })
        await db.disconnect();
        console.log(user)
        const token = signToken(user);
        res.send({
            token,
            _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
});

export default handler;