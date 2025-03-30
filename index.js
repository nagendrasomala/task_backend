const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://nagendrababusomala:nage2003@cluster0.hojaq.mongodb.net/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
    uid: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  });
const User = mongoose.model("User", UserSchema);

app.post("/api/register", async (req, res) => {
  const { uid, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ uid, password: hashedPassword });
  await user.save();
  res.json({ message: "User registered successfully" });
});

app.post("/api/login", async (req, res) => {
  const { uid, password } = req.body;
  const user = await User.findOne({ uid });
  if (!user) return res.status(400).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  const token = jwt.sign({ uid: user.uid }, "secret", { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

app.listen(5000, () => console.log("Server running on port 5000"));
