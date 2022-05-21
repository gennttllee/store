
import jwt from 'jsonwebtoken'

const signToken = (user) => {
    return jwt.sign({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRETS,
        { expiresIn: '30d' },
    );
};

const isAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.slice(7, authorization.length)
        jwt.verify(token, process.env.JWT_SECRETS, (err, decode) => {
            if (err) {
                res.status(401).send({ message: 'token is not valid' });
            } else {
                req.user = decode;
                next();
            }
        })
    } else {
        res.status(401).send({message : 'token is not supplied'})
    }
}
export { signToken, isAuth };