const session = require("express-session");
const MongoStore = require("connect-mongo").default;


module.exports = session({
    name: 'login-session',
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: "sessions"
    }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: false,
        sameSite: "lax"
    }
})