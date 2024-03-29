
import jwt from 'jsonwebtoken'
const JWTSECRETS = process.env.SECRETS

const signToken = (user) => {
    return jwt.sign({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
        JWTSECRETS,
        { expiresIn: '30d' },
    );
};

const isAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.slice(7, authorization.length)
        jwt.verify(token, JWTSECRETS, (err, decode) => {
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