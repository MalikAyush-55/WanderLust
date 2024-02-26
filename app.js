if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapasync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/expresserror.js");
const { listingschema } = require("./schema.js");
const Review = require("./models/reviews.js");
const { reviewschema } = require("./schema.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const user = require("./models/user.js");
const passport = require("passport");
const Localstrategy = require("passport-local");

const dburl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.once("error",()=>{
    console.log("ERROR in mongo session store", err);
})
const sessionoptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httponly:true,
    },
};


app.use(session(sessionoptions));

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



const port = 8080;


main().then((res)=>{
    console.log("Database connected successfully");
}).catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

async function main() {
  await mongoose.connect(dburl);
}

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
})

app.get("/",(req,res)=>{
    res.send("I am the root");
});
app.use("/listings", listingsRouter);
app.use("/listing/:id/review", reviewsRouter);
app.use("/", userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});
app.use((err ,req,res,next)=>{
    let {statusCode=500, message} = err;
    res.render("./listings/error.ejs",{message});
});
app.listen(port,(req,res)=>{
    console.log("Server working fine on port ", port);
})

