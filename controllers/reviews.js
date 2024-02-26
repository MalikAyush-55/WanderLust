const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.postnewreview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    await listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();

    console.log(newreview);
    req.flash("success","Review created successfully.");
    res.redirect(`/listings/${req.params.id}`);
}
module.exports.deletereview = async(req,res)=>{
    let {id, reviewid} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
    await Review.findByIdAndDelete(reviewid);

    req.flash("success","Review deleted successfully.");

    res.redirect(`/listings/${id}`);
}