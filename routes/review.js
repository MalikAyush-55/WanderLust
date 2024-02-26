const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/expresserror.js");
const { listingschema } = require("../schema.js");
const Review = require("../models/reviews.js");
const { reviewschema } = require("../schema.js");
const {isloggedin, isreviewauthor} = require("../middleware.js");

const reviewcontroller = require("../controllers/reviews.js");

const validatereview = (req,res,next)=>{
    let {error} = reviewschema.validate(req.body);
    if(error){
        let errmsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errmsg);
    }
    else{
        next();
    }
}

router.post("/", isloggedin,validatereview,wrapasync(reviewcontroller.postnewreview));

router.delete("/:reviewid", isloggedin, isreviewauthor, wrapasync(reviewcontroller.deletereview));

module.exports = router;