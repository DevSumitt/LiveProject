const Employe = require('../models/employe-model');
const bcrypt = require('bcryptjs');
exports.GetEmploye = async (req, res) => {
    try {
        const EmployeData = await Employe.find();
        return res.status(200).json({
            loggedIn: true,
            data: EmployeData
        });
    } catch {
        return res.status(500).json("Server Error")
    }
}
exports.PostEmploye = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.userpass;
    const date = req.body.date;
    const salary = req.body.salary;
    const hashed = await bcrypt.hash(pass, 10);
    const EmployeAdd = new Employe({ EmployeId: id, Name: name, Email: email, Password: hashed, Joined: date, Salary: salary })
    await EmployeAdd.save()
    res.json({ msg: 'Employe User Inserted' })
}

exports.DeleteEmploye = async (req, res) => {
    await Employe.findByIdAndDelete(req.body.id);
    res.json({ message: "User Deleted" });

}

exports.PutEmploye = async (req, res) => {
    const uid = req.body.Uniqueid;
    const eid = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const date = req.body.date;
    const salary = req.body.salary;
    const status = req.body.status;
    await Employe.findByIdAndUpdate(uid, { EmployeId: eid, Name: name, Email: email, Activated: status, Joined: date, Salary: salary }, { new: true });
    res.json({ message: "User Data Is updated" });
}


exports.loginEmploye = async (req, res) => {
    const { email, pass } = req.body;

    const getemp = await Employe.findOne({ Email: email });
    if (getemp == null) {
        return res.status(400).json({ msg: "User Not Found" })
    }

    const passmatched = await bcrypt.compare(pass, getemp.Password)

    if (!passmatched) {
        return res.status(400).json({ msg: "Incorrect Password" })
    } else {

        req.session.getemp = {
            id: getemp._id,
            email: getemp.Email,
            name: getemp.Name,
        }

        return res.status(201).json({ msg: "Login Sucessfully" })
    }




}


exports.adminlogout = async (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("login-session");
        res.json({ loggedOut: true });
    })
}


