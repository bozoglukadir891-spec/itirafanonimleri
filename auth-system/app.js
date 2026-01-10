const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const app = express();

// MongoDB bağlantısı
mongoose.connect("mongodb://127.0.0.1:27017/auth_demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "gizli-key",
  resave: false,
  saveUninitialized: true
}));

app.set("view engine", "ejs");

// Ana yönlendirme
app.get("/", (req, res) => res.redirect("/login"));

// REGISTER
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    res.send("Hata: " + err.message);
  }
});

// LOGIN
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send("Kullanıcı bulunamadı");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.send("Şifre yanlış");

  req.session.userId = user._id;
  res.redirect("/dashboard");
});

// DASHBOARD
app.get("/dashboard", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  const user = await User.findById(req.session.userId);
  res.render("dashboard", { user });
});

// LOGOUT
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// SERVER
app.listen(3000, () => {
  console.log("Server çalışıyor: http://localhost:3000");
});
