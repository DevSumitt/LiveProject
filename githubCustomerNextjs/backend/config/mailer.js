const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.User_email,
        pass:process.env.User_pass,
    },
    tls:{
        rejectUnauthorized:false
    }
})

module.exports = transporter;