const listing = require("./models/listing.js");
const review = require("./models/reviews.js");

module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl = req.originalUrl;
        req.flash("error", "You must be logged in order to create listing");
        return res.redirect("/login");
      }
      next();
};

module.exports.saveredirecturl = (req,res,next)=>{
      if(req.session.redirecturl){
        res.locals.redirecturl = req.session.redirecturl;
      }
      next();
};
module.exports.isowner = async (req,res,next)=>{
  let {id} = req.params;
  let listings = await listing.findById(id);
  if(!listings.owner.equals(res.locals.curruser._id)){
    req.flash("error", "You are not the owner of the listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports.isreviewauthor = async (req,res,next)=>{
  let {id, reviewid} = req.params;
  let currreview = await review.findById(reviewid);
  if(!currreview.author.equals(res.locals.curruser._id)){
    req.flash("error", "You are not the owner of the review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
