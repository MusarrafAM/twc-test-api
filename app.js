const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // To Avoid Network issues cross origin resourse sharing

// MongoDb
main().catch((err) => console.log(err));

async function main() {
  const app = express();
  app.use(cors());
  app.use(express.json()); // !Add this so that when getting data it will get as a json Data when reciving it.
  app.use(express.urlencoded({ extended: false }));

  await mongoose.connect("mongodb://127.0.0.1:27017/twc-test");

  // -------------  User Collection ------------------------------
  //   Create Schema
  const userSchema = new mongoose.Schema({
    email: String,
    password: String,
  });

  //   Create Model
  const User = mongoose.model("user", userSchema);

  //   Create Instance of the db Model.
  const newUser = new User({ email: "Musarraf", password: "123312" });

  // --------------  Contacts Collection ------------------------------
  //   Create Schema
  const contactSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    phone: String,
    gender: String,
  });

  //   Create Model
  const Contact = mongoose.model("contact", contactSchema);

  //   Create Instance of the db Model.
  const newContact = new Contact({
    fullname: "Muhammed Musarraf",
    email: "Musarraf@gmail.com",
    phone: "0779434492",
    gender: "Male",
  });

  //   !Save the Data in Database
  // await newUser.save();
  // await newContact.save();

  // Routes

  app.get("/", async function (req, res) {
    res.send("Main page");
  });

  // Register route
  app.post("/register", async function (req, res) {
    const email = req.body.email; //! Getting from api parameter.
    const password = req.body.password;
    const newUser = new User({ email: email, password: password });
    await newUser
      .save()
      .then((data) => {
        console.log("User Registred SUccesfully", data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  //Login Route
  app.post("/login", async function (req, res) {
    const email = req.body.email; //! Getting from api parameter.
    const password = req.body.password;

    const isUser = await User.findOne({ email: email });

    if (isUser && password === isUser.password) {
      res.send(true);
    } else {
      res.send(false);
    }
  });

  //Add Contact Data Route
  app.post("/add_contacts", async function (req, res) {
    const fullname = req.body.fullname; //! Getting from api parameter.
    const email = req.body.email;
    const phone = req.body.phone;
    const gender = req.body.gender;

    const newContact = new Contact({
      fullname: fullname,
      email: email,
      phone: phone,
      gender: gender,
    });

    await newContact
      .save()
      .then((data) => {
        console.log("User Registred SUccesfully", data);
      })
      .catch((err) => {
        console.log(err);
      });

    res.send(true);
  });

  //Get All Contact Data Route
  // app.get("/all_contacts", async function (req, res) {
  //   const all_contacts = await Contact.find({});
  //   res.send(all_contacts);
  // });

  app.get("/greet/:name", (req, res) => {
    res.send(`Welcome ${req.params.name}`);
  });

  app.listen(3000, function () {
    console.log("Server has started.");
  });
}
