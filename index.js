var express = require("express");

var userRoute = require("./routes/user");
var adminRoute = require("./routes/admin");
var loginRoute = require("./routes/login");

var bodyparser = require("body-parser");
var upload = require("express-fileupload");
var session = require("express-session");

var app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(upload());
app.use(
  session({
    secret: "A2Z IT HUB",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static("public"));

app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/login", loginRoute);

app.listen(1000);
