const dns = require('dns');
dns.setServers(['8.8.8.8', '4.2.2.2']);
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const bodyParse = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const myDB = require('./config/db');
const studentroutes = require('./routes/employe-routes');
const googleroutes = require('./routes/googleRoute');
const sessioninfo = require("./config/session");
const MongoStore = require("connect-mongo").default;

const app = express();

myDB();

require('./auth/google');

app.use(bodyParse.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use(sessioninfo);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", studentroutes);
app.use("/", googleroutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is working on port ${PORT}`);
});