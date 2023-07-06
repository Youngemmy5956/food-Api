import express from "express";
import User_model from "../model/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Customer_model from "../model/customers.js";
import Delivery_model from "../model/deliveries.js";
// import Food_model from "../model/foods.js";
// import Vendor_model from "../model/vendors.js";
// import Order_model from "../model/orders.js";

// import auth from "../middleware/auth.js";

const router = express.Router();

// Delivery routes

router.post("/delivery/register", async (req, res) => {
  const { firstName, lastName, email, address, phone } = req.body;
  if (!firstName || !lastName || !email || !address || !phone) {
    return res.status(400).json({ message: "all fields are required" });
  }
  try {
    const delivery = await Delivery_model.create({ firstName, lastName, email,  address, phone });
    res.status(201).json({ delivery });
  }
  catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// customer routes

router.post("/customer/register", async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  if (password.length < 8) {
    return res

      .status(400)
      .json({ message: "password is less than 8 characters" });
  }
  if (!firstName || !lastName || !email || !password || !phone) {
    return res.status(400).json({ message: "all fields are required" });
  }
  if (email.indexOf("@") === -1) {
    return res.status(400).json({ message: "invalid email" });
  }
  if (email.indexOf(".") === -1) {
    return res.status(400).json({ message: "invalid email" });
  }
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await Customer_model.create({
        firstName,
        lastName,
        email,
        phone,
        password: hash,
      }).then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, email },
          process.env.JWT_SECRECT_KEY,
          { expiresIn: maxAge }
        );
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ message: "user created successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/customer/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }
  if (email.indexOf("@") === -1) {
    return res.status(400).json({ message: "invalid email" });
  }
  if (email.indexOf(".") === -1) {
    return res.status(400).json({ message: "invalid email" });
  }
  try {
    await Customer_model.findOne({ email }).then((user) => {
      if (!user) {
        return res.status(400).json({ message: "invalid email" });
      }
      bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          return res.status(400).json({ message: "invalid password" });
        }
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, email },
          process.env.JWT_SECRECT_KEY,
          { expiresIn: maxAge }
        );
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ message: "user logged in successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customer/logout", async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "user logged out successfully" });
});

router.get("/customer", async (req, res) => {
  try {
    const customers = await Customer_model.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/customer/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Customer_model.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// auth register

router.post("/auth/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "password is less than 8 characters" });
  }
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }
  if (email.indexOf("@") === -1) {
    return res.status(400).json({ message: "invalid email" });
  }
  if (email.indexOf(".") === -1) {
    return res.status(400).json({ message: "invalid email" });
  }
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await User_model.create({
        firstName,
        lastName,
        email,
        password: hash,
      }).then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, email },
          process.env.JWT_SECRECT_KEY,
          { expiresIn: maxAge }
        );
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ message: "User successfully created", user });
      });
    });
  } catch (err) {
    res.status(400).json({
      message: "User not successfully created",
      error: err.message,
    });
  }
});

// auth login

router.post("/auth/login", async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password is provided
  if (!email || !password) {
    return res.status(400).json({ message: "email or password not provided " });
  }
  try {
    const user = await User_model.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ message: "Login not successful", error: "User not found" });
    } else {
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email },
            process.env.JWT_SECRECT_KEY,
            { expiresIn: maxAge }
          );

          // user.token = token;

          res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(201).json({ message: "Login successful", user, token });
        } else {
          res.status(400).json({ message: "Invalid Credentials" });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: "An error occurred", error: err.message });
  }
});

// get all data

router.get("/getAll", async (req, res) => {
  try {
    const data = await User_model.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get by id

router.get("/getById/:id", async (req, res) => {
  try {
    const data = await User_model.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update by id
router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const options = { new: true };

    const data = await User_model.findByIdAndUpdate(id, updateData, options);
    res.json(data);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User_model.findByIdAndDelete(id);
    res.status(201).json({ message: "User successfully deleted", data });
    // res.send(`User with name ${data.name} has been deleted..`);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "An error occurred",
      error: err.message,
    });
  }
});

// logout
router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});

export default router;
