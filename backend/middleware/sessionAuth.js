

module.exports = (req,res,next)=>{
    console.log(req.session.getemp);
    if(!req.session.getemp){
        return res.status(401).json({loggedIn:false})
    }

    next();
}