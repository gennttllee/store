import bcrypt from "bcryptjs";
import nc from "next-connect";
import User from '../../../models/User'
import { signToken } from "../../../utils/auth";
import {database} from "../../../utils/db";

database();
const handler = nc();

handler.get(async (req, res) => {
    const {email} = req.query;
    try {
        const user = await User.findOne({ email });
        if (user) {
            res.status(201).json({ email: user.email, name: user.name });
        } else {
            res.status(401).json( 'No user found' )
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
});

handler.post(async (req, res) => {
    const { email, password, name } = req.body;
    const user = await new User({ name, email, password: bcrypt.hashSync(password), isAdmin: false });
    try {
        await user.save();
        const token = signToken(user);
        res.status(200).json({ token, _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin })
    } catch (error) {
        res.status(500).json(error.message)
    }
});

export default handler;