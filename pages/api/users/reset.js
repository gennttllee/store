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
        const token = signToken(user);
        res.status(201).json({token,_id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin })
    } catch (error) {
        res.status(500).json(error)
    }
});

export default handler;