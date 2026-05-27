const express = require('express');
const sessionAuth = require('../middleware/sessionAuth');
const customerAuth = require('../middleware/customer');
const userAuth = require('../middleware/userAuth');
const EmployeController = require('../controller/employe-controller');
const AttendenceController = require('../controller/attendence');
const UserController = require('../controller/userController');
const uploadPic = require("../middleware/uploadPic");
const roomController = require('../controller/room-controller');
const BookController = require('../controller/book-controller');
const router = express.Router();

router.get('/Employerdetails', sessionAuth, EmployeController.GetEmploye);
router.post('/Employerdetails/delete', EmployeController.DeleteEmploye);
router.put('/Employerdetails', EmployeController.PutEmploye);
router.post('/Employerdetails', EmployeController.PostEmploye);
router.post("/attendence", AttendenceController.Postattendence);
router.get("/attendence", AttendenceController.Getattendence);
router.delete("/attendence/:id", AttendenceController.DeleteAttendence);
router.get("/atDetails/:email", AttendenceController.atDetails);
router.get("/atDateDetails/:date", AttendenceController.dateDetails);
router.post("/loginEmploye", EmployeController.loginEmploye);
router.post('/sessionDestroy', EmployeController.adminlogout)
router.post('/LoginUser', UserController.loginUser);
router.get('/getUser', UserController.getinfo);
router.post('/UserSessionDestroy', UserController.logoutUser);
router.put('/UserupdatePass', UserController.userChangepass);
router.get('/getUserattendence/:email', UserController.getUserAttendence);
router.post('/SendOtp', UserController.OtpSend);
router.post('/VerifyOtp', UserController.VerifyOtp);
router.post('/SignUpSendOtp', UserController.SignupSendOtp);
router.post('/SignUp', UserController.UserSignUp);
router.post('/Verify', UserController.verify);
router.post('/uploadsProfile', uploadPic.single("file"), UserController.UploadFile);
router.post('/api/signup', UserController.usersign);
router.post('/api/verifyOtp', UserController.otpverify);
router.post('/api/logincustomer', UserController.cuslogin);
router.post('/api/add-rooms', roomController.addRoom);
router.get('/api/get-rooms', roomController.getRoom);
router.delete('/api/delete-room/:id', roomController.DeleteRoom);
router.get('/api/get-customerinfo', customerAuth, UserController.getCustomer);
router.post('/api/logout-customer', UserController.customerlogout);
router.post('/api/book-now', BookController.booking);
router.get('/api/getBooking-info', BookController.getBooking);
router.delete('/api/deleteBooking/:id', BookController.DeleteBooking);




module.exports = router;