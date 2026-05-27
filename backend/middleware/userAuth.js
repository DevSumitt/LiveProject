// middleware/auth.js
const isAuth = (req, res, next) => {
    if (req.session.userFound) {
        next();
    } else {
        res.status(401).json({ msg: "Login required" });
    }
};