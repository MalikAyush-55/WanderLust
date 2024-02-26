const user = require("../models/user");

module.exports.signup = async(req,res)=>{
    try{
    let {username,password,email} = req.body;
    const newuser = new user({email,username});
    const registereduser = await user.register(newuser,password);
    req.login(registereduser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to WnaderLust!");
        res.redirect("/listings");
    })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
};
module.exports.login = async(req,res)=>{
    req.flash("success", "Welcome to WanderLust! You are logged in!");
    if(res.locals.redirecturl){
        res.redirect(res.locals.redirecturl);
    }
    else{
        res.redirect("/listings");
    }
}