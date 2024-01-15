const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const port = 4000;
const user = require("./models/user.js");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET || "defaultSecret";
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const post = require("./models/Post.js");

const uploadmiddleware = multer({ dest: "uploads/" });
const upload = multer();

app.UseCors((x) =>
  x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed((origin) => true) // allow any origin
    .AllowCredentials()
);
app.use(express.json());
app.use(cookieparser());
// app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(process.env.MONGODB_URI);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userdoc = await user.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userdoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userdoc = await user.findOne({ username });
  if (!userdoc) {
    return res.status(400).json({ error: "User not found" });
  }
  const passcheck = bcrypt.compareSync(password, userdoc.password);
  if (passcheck) {
    jwt.sign({ username, id: userdoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userdoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("Invalid password!");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

app.post("/post", upload.none(), async (req, res) => {
  try {
    const { title, summary, content, url } = req.body;
    const { token } = req.cookies;

    // You should add validation here to ensure all required fields are present.

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;

      const postdoc = await post.create({
        title,
        summary,
        content,
        cover: url,
        author: info.id,
      });

      res.json(postdoc);
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/post", async (req, res) => {
  const posts = await post
    .find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);
  res.json(posts);
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postdoc = await post.findById(id).populate("author", ["username"]);
  res.json(postdoc);
});

app.put("/post", upload.none(), async (req, res) => {
  // res.json(req.body);
  try {
    const { id, title, summary, content, url } = req.body;
    const { token } = req.cookies;

    // You should add validation here to ensure all required fields are present.

    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const postdoc = await post.findById(id);
      const isauthor =
        JSON.stringify(postdoc.author) === JSON.stringify(info.id);
      // res.json({isauthor,postdoc,info});

      if (!isauthor) {
        return res.status(400).json("You are not the author :/");
      }
      await postdoc.updateOne({ title, summary, content, cover: url });
      // const postdoc = await post.create({
      //   title,
      //   summary,
      //   content,
      //   cover: url,
      //   author: info.id,
      // });

      res.json(postdoc);
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
