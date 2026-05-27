const User = require('../models/employe-model');
const bcrypt = require('bcryptjs');
const attendence = require('../models/attendence');
const transpoter = require('../config/mailer');
const customer = require('../models/customer');

exports.loginUser = async (req, res) => {
    const { email, pass } = req.body;
    const userFound = await User.findOne({ Email: email });

    if (!userFound) {
        return res.status(400).json({ msg: "User Not Found" })
    }
    const passmatched = await bcrypt.compare(pass, userFound.Password)
    if (!passmatched) {
        return res.status(400).json({ msg: "Incorrect Password" })
    }
    if (userFound.Activated == "no") {
        return res.status(400).json({ msg: "your account is disabled plz contact admin" })
    } else {
        req.session.userFound = {
            id: userFound._id,
            email: userFound.Email,
            name: userFound.Name,
        }
        return res.status(201).json({ msg: "Login Sucessfully" })

    }

}

exports.UploadFile = async (req, res) => {
    const userEmail = req.body.email;
    const ismatch = await User.findOne({ Email: userEmail });
    if (!ismatch) {
        return res.status(400).json({ msg: "user Not Found" });
    }
    if (!req.file) {
        return res.status(400).json({ msg: "file not uploaded" });
    }

    await User.findByIdAndUpdate(
        ismatch._id,
        { ProfileImg: req.file.path },
        { new: true }
    );
    res.json({ message: "Profile Pic upload successfully!" });

};


exports.getinfo = async (req, res) => {

    if (!req.session.customerFound) {
        return res.status(401).json({
            loggedIn: false,
            msg: "Unauthorized: Please login first"
        });
    }

    try {
        const userEmail = req.session.customerFound.email;


        const UserData = await User.findOne({ Email: userEmail });
        if (!UserData) {
            return res.status(404).json({ msg: "User data not found" });
        }

        return res.status(200).json({
            loggedIn: true,
            data: UserData
        });
    } catch (error) {


        return res.status(500).json({ msg: "Server Error", error: error.message });
    }
}



exports.userChangepass = async (req, res) => {
    try {
        const { userid, newPs, currentPs } = req.body;

        const updatedUser = await User.findOne({ _id: userid });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const ismatched = await bcrypt.compare(currentPs, updatedUser.Password);
        if (!ismatched) {
            res.json({ message: "password does not match" });
        }

        const hashedPassword = await bcrypt.hash(newPs, 10);
        await User.findByIdAndUpdate(
            userid,
            { Password: hashedPassword },
            { new: true }
        );
        res.json({ message: "Password updated successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}


exports.getUserAttendence = async (req, res) => {
    const attendenceData = await attendence.find({ Email: req.params.email });
    res.json(attendenceData);
}

exports.logoutUser = async (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("login-session");
        res.json({ loggedOut: true });
    })
}







exports.OtpSend = async (req, res) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const { email } = req.body;
    const isUserMatch = await User.findOne({ Email: email });
    if (!isUserMatch) {
        res.send({ msg: "User not found", status: 401 })
    }
    const SetOtp = await User.findByIdAndUpdate(
        isUserMatch._id,
        { Otp: otp },
        { new: true }
    );
    await transpoter.sendMail({
        from: process.env.User_email,
        to: email,
        subject: "Otp Verification Msg.....",
        html: `<h2>Your 4 Digit Otp Is</h2> ${otp}`
    })

    res.json({ msg: "otp sent successfully to the email", status: 201 })

}


exports.VerifyOtp = async (req, res) => {
    try {
        const { otp, newps, currentps, email } = req.body;

        const updatedUser = await User.findOne({ Email: email });
        console.log(updatedUser)
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (otp != updatedUser.Otp) {
            return res.status(401).json({ message: "Wrong OTP" });
        }

        const isMatched = await bcrypt.compare(currentps, updatedUser.Password);
        if (!isMatched) {
            return res.status(401).json({ message: "Current password does not match" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newps, saltRounds);

        await User.findByIdAndUpdate(
            updatedUser._id,
            {
                Password: hashedPassword,
            },
            { new: true }
        );

        return res.status(200).json({ message: "Password updated successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};



exports.SignupSendOtp = async (req, res) => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const { email } = req.body;
    const isUserMatch = await User.findOne({ Email: email });

    if (!isUserMatch) {
        res.send({ msg: "User not found", status: 401 })
    }

    const SetOtp = await User.findByIdAndUpdate(
        isUserMatch._id,
        { isSignotp: otp },
        { new: true }
    );
    await transpoter.sendMail({
        from: process.env.User_email,
        to: email,
        subject: "Signup Otp Verification Msg.....",
        html: `<h2>Your 4 Digit Otp Is</h2> ${otp}`
    })

    res.json({ msg: "otp sent successfully to the email", status: 201 })

}


exports.UserSignUp = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ msg: 'All Field Are Required', status: 401 })
    }
    const hashed = await bcrypt.hash(password, 10);
    const UserAdd = new User({ Name: name, Email: email, Password: hashed })
    await UserAdd.save()
    res.json({ msg: 'User Signup successfully', status: 201 })
}


exports.verify = async (req, res) => {
    try {
        const { otp, otpMsg } = req.body;

        const updatedUser = await User.findOne({ Email: otpMsg });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (otp != updatedUser.isSignotp) {
            return res.status(401).json({ message: "Wrong OTP" });
        }
        await User.findByIdAndUpdate(
            updatedUser._id,
            { isSignotp: otp, isVerify: "true" },
            { new: true }
        );
        return res.status(200).json({ message: "Account successfully verify!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};



exports.usersign = async (req, res) => {
    const { name, email, number, password } = req.body;

    try {
        if (!name || !email || !number || !password) {
            return res.status(400).json({ msg: 'Please fill all details' });
        }

        let existingCustomer = await customer.findOne({ Email: email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Customer already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(1000 + Math.random() * 9000);

        const newCustomer = new customer({
            Name: name,
            Email: email,
            Number: number,
            Password: hashedPassword,
            Otp: otp
        });

        await newCustomer.save();

        await transpoter.sendMail({
            from: process.env.User_email,
            to: email,
            subject: "Customer Signup Otp Verification Msg.....",
            html: `<h2>Your 4 Digit Otp Is</h2> ${otp}`
        });

        return res.status(201).json({
            success: true,
            message: "Customer registered and OTP sent successfully to email",
            otpSent: true
        });

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Server error during signup" });
        }
    }
};

exports.otpverify = async (req, res) => {
    const { email, otp } = req.body;
    const updatedUser = await customer.findOne({ Email: email });
    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }
    if (otp != updatedUser.Otp) {
        return res.status(401).json({ message: "Wrong OTP" });
    }
    await customer.findByIdAndUpdate(
        updatedUser._id,
        { Otp: otp, isVerify: "true" },
        { new: true }
    );
    return res.status(200).json({ message: "Account successfully verify!" });

}


exports.cuslogin = async (req, res) => {
    const { email, password } = req.body;
    const customerFound = await customer.findOne({ Email: email });
    if (!customerFound) {
        return res.status(400).json({ msg: "User Not Found" })
    }
    const passmatched = await bcrypt.compare(password, customerFound.Password)
    if (!passmatched) {
        return res.status(400).json({ msg: "Incorrect Password" })
    }


    req.session.customerFound = {
        id: customerFound._id,
        email: customerFound.Email,
        name: customerFound.Name,
    }



    return res.status(201).json({ msg: "Login Sucessfully" })

}

exports.getCustomer = async (req, res) => {
    try {

        var email = "";
        if (req.session.customerFound) {
            email = req.session.customerFound.email;
        } else {
            email = req.session.passport.user._json.email;
        }
        const Data = await customer.findOne({ Email: email });
        return res.status(200).json({
            loggedIn: true,
            data: Data
        });
    } catch {
        return res.status(500).json("Server Error")
    }
}





exports.customerlogout = async (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("login-session");
        res.json({ loggedOut: true });
    })
}