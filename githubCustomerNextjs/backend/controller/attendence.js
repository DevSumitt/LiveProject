const attendence = require('../models/attendence');

exports.Postattendence = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const status = req.body.status;
    const date = req.body.date;

    const emplyAdd = new attendence({ Name: name, Email: email, Date: date, Status: status })
    await emplyAdd.save()
    res.json({ messgae: 'Attendence MArked Succesfulyy' })

}

exports.Getattendence = async (req, res) => {
    const attendenceData = await attendence.find();
    res.json(attendenceData);

}

exports.DeleteAttendence = async (req, res) => {
    await attendence.findByIdAndDelete(req.params.id)
    res.send("Attendence Deleted");
}


exports.atDetails = async (req, res) => {
    const data = await attendence.find({ Email: req.params.email });
    res.json(data);
 
}
exports.dateDetails = async (req, res) => { 
    const data = await attendence.find({ Date: req.params.date });
    res.json(data);

}