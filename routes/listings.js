const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/expresserror.js");
const { listingschema } = require("../schema.js");
const Review = require("../models/reviews.js");
const { reviewschema } = require("../schema.js");
const {isloggedin, isowner} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingcontroller = require("../controllers/listings.js");

const validatelisting = (req,res,next)=>{
    let {error} = listingschema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errmsg);
    }
    else{
        next();
    }
}

router.get("/",wrapasync( listingcontroller.index));
  router.get("/new", isloggedin,(req,res)=>{
    
    res.render("listings/new.ejs");
});
router.post("/",isloggedin,upload.single("Listing[image]"), listingcontroller.newlisting );

router.delete("/:id/delete",isloggedin, isowner,wrapasync(listingcontroller.deletelisting));

router.get("/:id/edit",isloggedin,isowner, wrapasync(listingcontroller.editlisting));

router.put("/:id", isloggedin, isowner,upload.single("Listing[image]"),wrapasync(listingcontroller.putlisting));
  
router.get("/:id",wrapasync(listingcontroller.showlisting));

module.exports = router;