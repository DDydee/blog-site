const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const connectDB = process.env.DB_URL;

mongoose
  .connect(connectDB, { autoIndex: true })
  .then(() => {
    console.log("--------------------Connected to MongoDB--------------------");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(
      "--------------------Couldn't connect to MongoDB--------------------"
    );
    console.error(err);
  });

const app = express();

app.set("view engine", "ejs");

//middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      collectionName: "session",
    }),
  })
);

//routes
app.get("/", (req, res) => {
  res.redirect("/blogs/");
});
app.get("/about", (req, res) => {
  res.render("about.ejs", { title: "About" });
});

app.use("/blogs", blogRoutes);

app.use("/user", userRoutes);

app.use((req, res) => {
  res.status(404).render("404.ejs", { title: "404" });
});
