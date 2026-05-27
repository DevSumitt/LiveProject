module.exports = (req, res, next) => {

    // console.log(req.session.passport.user._json);  
    if (!req.session.customerFound && !req.session.passport) {
        return res.status(401).json({ loggedIn: false });
    }
    // || !req.session.customerFound
    next();
}