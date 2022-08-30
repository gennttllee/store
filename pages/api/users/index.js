import bcrypt from "bcryptjs";
import nc from "next-connect";
import User from '../../../models/User'
import { signToken } from "../../../utils/auth";
import {database} from "../../../utils/db";

database();
const handler = nc();

handler.post(async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(401).json( 'user does not exist' );
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = signToken(user);
            res.status(201).json({ token, _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin })
        } else {
            res.status(401).json({ message: 'invalid user or password' })
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
});

handler.patch(async (req, res) => {
    try {
        const user = await User.updateOne({ email: req.body.email }, { $set: { password: bcrypt.hashSync(req.body.password) } })
        const token = signToken(user);
        res.status(201).json({token,_id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin })
    } catch (error) {
        res.status(500).json(error.message)
    }
});

export default handler;