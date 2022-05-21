import nc from "next-connect";
import User from '../../../models/User'
import db from "../../../utils/db";

const handler = nc();

handler.post(async (req, res) => {
    await db.connect();
    const user = await User.findOne({ email: req.body.email });
    await db.disconnect();
    if (user) {
        res.send(
            [user.email, user.name]
        )
    } else {
        res.status(401).send({ message: 'No user found' })
    }
});

export default handler;