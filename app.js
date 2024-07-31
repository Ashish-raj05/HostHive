require('dotenv').config()
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const { url } = require("inspector");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public"))); //to use css file
app.use(express.urlencoded({ extended: true })); //to understand the input data
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

main().then(() => {
    console.log("connection successful");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

app.get("/", (req, res) => {
    res.send("Hi! I am root");
});

//index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});

//new route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
});

//create route
app.post("/listings", async (req, res) => {
    let { title, description, price, image, location, country } = req.body;
    let listing = new Listing(req.body.listing);
        
    listing.save();
    res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
});

//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
    
});

//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
   await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    
});

app.listen(PORT, () => {
    console.log("app is listening to port 8080");
});