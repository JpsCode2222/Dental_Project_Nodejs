var express = require("express");
var exec = require("./connection");
var route = express.Router();

route.get("/", async function (req, res) {
  var info = await exec(`SELECT * FROM  basic_information`);
  var slides = await exec(`SELECT * FROM slider`);
  var opening_hrs = await exec(`SELECT * FROM opening_hours`);
  var about = await exec(`SELECT * FROM about_us`);
  var service = await exec("SELECT * FROM service_heading");
  var service_det = await exec("SELECT * FROM service");
  var review = await exec("SELECT * FROM review");
  res.render("user/home.ejs", {
    info: info[0],
    slides: slides,
    opening_hrs: opening_hrs,
    about: about[0],
    service: service[0],
    service_det: service_det,
    review: review,
  });
});

route.get("/about", async function (req, res) {
  var info = await exec(`SELECT * FROM  basic_information`);
  var about = await exec(`SELECT * FROM about_us`);
  res.render("user/about.ejs", { info: info[0], about: about[0] });
});

route.get("/service", async function (req, res) {
  var info = await exec(`SELECT * FROM  basic_information`);
  var service_det = await exec("SELECT * FROM service");
  res.render("user/service.ejs", { info: info[0], service_det: service_det });
});

route.get("/team", async function (req, res) {
  var info = await exec(`SELECT * FROM  basic_information`);
  res.render("user/team.ejs", { info: info[0] });
});

route.get("/contact", async function (req, res) {
  var info = await exec(`SELECT * FROM  basic_information`);
  res.render("user/contact.ejs", { info: info[0] });
});

route.get("/appointment", async function (req, res) {
  var info = await exec(`SELECT * FROM  basic_information`);
  var services = await exec(`SELECT * FROM  service`);
  res.render("user/appointment.ejs", { info: info[0], services: services });
});

route.post("/save_contact_details", async function (req, res) {
  res.send(req.body);
});

// api for fetch data from db of doctors
route.get(
  "/get_doctor_list_by_service_id/:service_id",
  async function (req, res) {
    var service_id = req.params.service_id;
    var data = await exec(
      `SELECT * FROM doctor WHERE doctor_service_id = '${service_id}'`
    );
    res.send(data);
  }
);

route.post("/save_appointment", async function (req, res) {
  var d = req.body;
  var sql = `INSERT INTO appointment(appointment_id,service_id,doctor_id,patient_name,patient_mobile,appointment_date,appointment_time,status) VALUES ('${d.appointment_id}','${d.service_id}','${d.doctor_id}','${d.patient_name}','${d.patient_mobile}','${d.appointment_date}','${d.appointment_time}','Pending')`;
  var data = await exec(sql);
  // res.send(data);
  res.redirect("/");
});

module.exports = route;

// CREATE TABLE appointment (appointment_id INT PRIMARY KEY AUTO_INCREMENT,service_id INT,doctor_id INT,patient_name TEXT,patient_mobile VARCHAR(20),appointment_date VARCHAR(200),appointment_time VARCHAR(100))
