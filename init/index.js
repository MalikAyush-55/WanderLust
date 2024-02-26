const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

let MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main().then((res)=>{
    console.log("Database connected successfully");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const datainit = async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj, owner:"65bbbd61e5cedf5a0ff26dc3"}));
    await Listing.insertMany(initdata.data);
}

datainit();