const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
  }
module.exports.newlisting = async (req,res,next)=>{
  console.log(req.file);
  let url = req.file.path;
  let filename = req.file.filename;
  let newlisting = new Listing(req.body.Listing);
    console.log(newlisting);
    newlisting.owner = req.user._id;
    newlisting.image = {filename, url};
    await newlisting.save();
    req.flash("success", "New location added successfully");
    res.redirect("/listings/");
}
module.exports.deletelisting = async (req,res)=>{
    let {id} = req.params;
    let dl = await Listing.findByIdAndDelete(id);
    console.log(dl);
    req.flash("success","A location is deleted");
    res.redirect("/listings");
}
module.exports.editlisting = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing does not exist.");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}
module.exports.putlisting = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.Listing});

    if(typeof req.file !== "undefined"){
      let filename = req.file.filename;
      let url = req.file.path;
      listing.image = {filename, url};
      await listing.save();
    }
    req.flash("success","The location is updated successully");
    res.redirect(`/listings/${id}`);
}
module.exports.showlisting = async (req,res)=>{
    const {id} = req.params;
    let listing = await Listing.findById(id).populate(
      {path:"reviews", 
      populate:{
      path:"author"
    }}).populate("owner");
    if(!listing){
      req.flash("error","Listing does not exist.");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}