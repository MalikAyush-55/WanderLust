const express = require("express");
const router = express.Router();
const user = require("../models/user");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const {saveredirecturl} = require("../middleware.js");

const usercontroller = require("../controllers/users.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup", usercontroller.signup);

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});
router.post("/login",
   saveredirecturl,
   passport.authenticate("local",{
   failureRedirect : "/login",
   failureFlash: true}),
   usercontroller.login
)
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out successfully.");
        res.redirect("/listings");
    });
});
module.exports = router;
