var express = require("express");
const exec = require("./connection");
var route = express.Router();

route.get("/", function (req, res) {
  res.render("login/login.ejs");
});

route.post("/check_admin", async function (req, res) {
  var d = req.body;
  var sql = `SELECT * FROM admin WHERE admin_email = '${d.username}' AND admin_password='${d.password}'`;
  var data = await exec(sql);
  //   login process
  if (data.length > 0) {
    req.session["admin_id"] = data[0].admin_id;
    res.redirect("/admin/");
  } else {
    res.redirect("/login/");
  }
});

module.exports = route;
