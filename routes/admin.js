var express = require("express");
var exec = require("./connection");

var route = express.Router();

// login validation
// next : use for check some conditions and go to next url with same name
// To avoid unessary function rewriting use another method but use next

// route.get('/',async function(req,res,next){
//   console.log("Validation")
//   next();
// })
/////////////////////////////////////////////////////////////////////////

function checkAdmin(req, res, next) {
  if (req.session.admin_id == undefined) res.redirect("/login/");
  if (req.session.admin_id != undefined) next();
}

route.get("/", checkAdmin, async function (req, res) {
  var year = new Date().getFullYear();
  var month = new Date().getMonth() + 1;
  var date = new Date().getDate();
  var month = month < 10 ? "0" + month : month;
  var date = date < 10 ? "0" + date : date;
  var today = year + "-" + month + "-" + date;
  // console.log(today);
  var appointments = await exec(
    `SELECT * FROM appointment,service,doctor WHERE appointment.service_id = service.service_id AND appointment.doctor_id = doctor.doctor_id AND appointment_date ='${today}'`
  );
  res.render("admin/home.ejs", { appointments: appointments });
});

// To highlight the page which we see this page navbar name activ hint
// 1> pass to page {page:"Home"} then acess page in rendered page and user ternary operator and set class active to it
// or 2>  use js with location.pathname and use id to nav items and set active to it

route.get("/basic_info", checkAdmin, async function (req, res) {
  var sql = `SELECT * FROM basic_information`;
  var data = await exec(sql);
  // here data[0] use for we need to fetch only single data IMP
  res.render("admin/Basic_Information.ejs", { info: data[0] });
});

route.post("/save_basic_info", checkAdmin, async function (req, res) {
  var d = req.body;
  var sql = `UPDATE basic_information SET mobile='${d.mobile}',email_id='${d.email_id}',address='${d.address}',twitter_link='${d.twitter_link}',facebook_link='${d.facebook_link}',linkedin_link='${d.linkedin_link}',instagram_link='${d.instagram_link}',map_link='${d.map_link}',heading='${d.heading}'`;
  var data = await exec(sql);
  res.redirect("/admin/basic_info");
});

route.get("/slider", checkAdmin, async function (req, res) {
  var slide = await exec("SELECT * FROM slider");
  res.render("admin/slider.ejs", { slides: slide });
});

route.post("/save_slider", checkAdmin, async function (req, res) {
  var d = req.body;
  if (req.files === undefined) {
    var slider_image = "";
  } else {
    var slider_image = new Date().getTime() + req.files.slider_image.name;
    req.files.slider_image.mv("public/img/" + slider_image);
  }

  var sql = `INSERT INTO slider (slider_image,slider_title,slider_short_title)  VALUES ('${slider_image}','${d.slider_title}','${d.slider_short_title}')`;
  var data = await exec(sql);
  res.redirect("/admin/slider");
});

route.get("/edit_slider/:id", checkAdmin, async function (req, res) {
  var d = req.body;
  var sql = `SELECT * FROM slider WHERE slider_id = '${req.params.id}'`;
  var data = await exec(sql);
  res.render("admin/edit_slider.ejs", { info: data[0] });
});

route.post("/update_slider", checkAdmin, async function (req, res) {
  var d = req.body;
  if (req.files === undefined) {
    var sql = `UPDATE slider SET slider_title='${d.slider_title}',slider_short_title='${d.slider_short_title}' WHERE slider_id = '${d.slider_id}'`;
    await exec(sql);
  } else {
    var slider_image = new Date().getTime() + req.files.slider_image.name;
    req.files.slider_image.mv("public/img/" + slider_image);
    var sql = `UPDATE slider SET slider_image='${slider_image}',slider_title='${d.slider_title}',slider_short_title='${d.slider_short_title}' WHERE slider_id = '${d.slider_id}'`;
    await exec(sql);
  }
  res.redirect("/admin/slider");
});

route.get("/delete_slider/:id", checkAdmin, async function (req, res) {
  await exec(`DELETE FROM slider WHERE slider_id = ${req.params.id}`);
  res.redirect("/admin/slider");
});

route.get("/opening_hours", checkAdmin, async function (req, res) {
  var data = await exec(`SELECT * FROM opening_hours`);
  res.render("admin/opening_hours.ejs", { data: data });
});

route.post("/save_opening_hours", checkAdmin, async function (req, res) {
  var d = req.body;
  var sql = `INSERT INTO opening_hours (day,time) VALUES ('${d.day}','${d.time}')`;
  var data = await exec(sql);
  res.redirect("/admin/opening_hours");
});

route.get("/edit_opening_hours/:id", checkAdmin, async function (req, res) {
  var data = await exec(
    `SELECT * FROM opening_hours WHERE opening_hours_id = '${req.params.id}'`
  );
  res.render("admin/edit_opening_hours.ejs", { info: data[0] });
});

route.post("/update_opening_hours", checkAdmin, async function (req, res) {
  var d = req.body;
  var sql = `UPDATE opening_hours SET day = '${d.day}' , time = '${d.time}' WHERE opening_hours_id = '${d.opening_hours_id}'`;
  var data = await exec(sql);
  res.redirect("/admin/opening_hours");
});

route.get("/delete_opening_hours/:id", checkAdmin, async function (req, res) {
  var data = await exec(
    `DELETE FROM opening_hours WHERE opening_hours_id = '${req.params.id}'`
  );
  res.redirect("/admin/opening_hours");
});

route.get("/about_us", checkAdmin, async function (req, res) {
  var data = await exec(`SELECT * FROM about_us`);
  res.render("admin/about_us.ejs", { data: data[0] });
});

route.post("/save_about_us", checkAdmin, async function (req, res) {
  var d = req.body;
  if (req.files) {
    var img = new Date().getTime() + req.files.about_img.name;
    req.files.about_img.mv("public/img/" + img);
    await exec(`UPDATE about_us SET about_img = '${img}'`);
  }
  var sql = `UPDATE about_us SET title = '${d.title}',heading = '${d.heading}',description = '${d.description}',key_point1 = '${d.key_point1}',key_point2 = '${d.key_point2}',key_point3 = '${d.key_point3}',key_point4 = '${d.key_point4}'`;
  var data = await exec(sql);
  res.redirect("/admin/about_us");
});

route.get("/services_heading", checkAdmin, async function (req, res) {
  var data = await exec("SELECT * FROM service_heading");
  res.render("admin//services_heading.ejs", { service: data[0] });
});

route.post("/save_service_heading", checkAdmin, async function (req, res) {
  if (req.files) {
    if (req.files.before_img) {
      var before_img = new Date().getTime() + req.files.before_img.name;
      req.files.before_img.mv("public/img/" + before_img);
      var sql = `UPDATE service_heading SET before_img = '${before_img}'`;
      await exec(sql);
    }
    if (req.files.after_img) {
      var after_img = new Date().getTime() + req.files.after_img.name;
      req.files.after_img.mv("public/img/" + after_img);
      var sql = `UPDATE service_heading SET after_img = '${after_img}'`;
      await exec(sql);
    }
  }
  var d = req.body;
  // var sql = `INSERT INTO service_heading (heading) Values ('')`;
  var sql = `UPDATE service_heading SET heading = '${d.heading}'`;
  await exec(sql);
  res.redirect("/admin/services_heading");
});

route.get("/manage_services", checkAdmin, async function (req, res) {
  var data = await exec("SELECT * FROM service");
  res.render("admin/manage_services.ejs", { service: data });
});

route.post("/save_service", checkAdmin, async function (req, res) {
  var service_img = new Date().getTime() + req.files.service_img.name;
  req.files.service_img.mv("public/img/" + service_img);
  var d = req.body;
  var sql = `INSERT INTO service(service_name,service_img,service_price,key_point1,key_point2,key_point3) VALUES ('${d.service_name}','${service_img}','${d.service_price}','${d.key_point1}','${d.key_point2}','${d.key_point3}')`;
  var data = await exec(sql);
  res.redirect("/admin/manage_services");
});

route.get("/edit_service/:id", checkAdmin, async function (req, res) {
  var sql = `SELECT * FROM service WHERE service_id = '${req.params.id}'`;
  var data = await exec(sql);
  res.render("admin/edit_services.ejs", { service: data[0] });
});

route.post("/update_service", checkAdmin, async function (req, res) {
  var d = req.body;
  if (req.files.service_img) {
    var service_img = new Date().getTime() + req.files.service_img.name;
    req.files.service_img.mv("public/img/" + service_img);
    var sql = `UPDATE service SET service_img = '${service_img}' WHERE service_id = '${d.service_id}'`;
    await exec(sql);
  }
  var sql = `UPDATE service SET service_name='${d.service_name}',service_price='${d.service_price}',key_point1='${d.key_point1}',key_point2='${d.key_point2}',key_point3='${d.key_point3}' WHERE service_id = '${d.service_id}'`;
  var data = await exec(sql);
  res.redirect("/admin/manage_services");
});

route.get("/delete_service/:id", checkAdmin, async function (req, res) {
  var sql = `DELETE FROM service WHERE service_id = '${req.params.id}'`;
  var data = await exec(sql);
  res.redirect("/admin/manage_services");
});

route.get("/doctors", checkAdmin, async function (req, res) {
  var service_list = await exec("SELECT * FROM service");
  var doctor = await exec(
    "SELECT * FROM doctor,service where doctor.doctor_service_id = service.service_id"
  );
  res.render("admin/doctors.ejs", {
    service_list: service_list,
    doctor: doctor,
  });
});

route.post("/save_doctor", checkAdmin, async function (req, res) {
  var d = req.body;
  var doctor_img = new Date().getTime() + req.files.doctor_img.name;
  req.files.doctor_img.mv("public/img/" + doctor_img);
  var sql = `INSERT INTO doctor(doctor_name,doctor_mobile,doctor_email,Specialist,doctor_service_id,twitter_link,linkedin_link,facebook_link,instagram_link,doctor_img) VALUES ('${d.doctor_name}','${d.doctor_mobile}','${d.doctor_email}','${d.Specialist}','${d.doctor_service_id}','${d.twitter_link}','${d.linkedin_link}','${d.facebook_link}','${d.instagram_link}','${doctor_img}')`;
  var data = await exec(sql);
  res.redirect("/admin/doctors");
});

route.get("/edit_doctor/:id", checkAdmin, async function (req, res) {
  var doctor = await exec(
    `SELECT * FROM doctor WHERE doctor_id = '${req.params.id}'`
  );
  var service = await exec(
    "SELECT * FROM doctor,service where doctor.doctor_service_id = service.service_id"
  );
  // var serviceinfo = await exec(
  //   `SELECT * FROM doctor,service where doctor.doctor_service_id='${req.params.id}' AND doctor.doctor_service_id = service.service_id`
  // );
  res.render("admin/edit_doctor.ejs", {
    doctor: doctor[0],
    service: service,
    // serviceinfo: serviceinfo[0],
  });
});

route.get("/delete_doctor/:id", checkAdmin, async function (req, res) {
  var sql = `DELETE FROM doctor WHERE doctor_id = '${req.params.id}'`;
  var data = await exec(sql);
  res.redirect("/admin/doctors");
});

route.get("/reviews", checkAdmin, async function (req, res) {
  var reviews = await exec("SELECT * FROM review");
  res.render("admin/reviews.ejs", { reviews: reviews });
});

route.post("/save_review", checkAdmin, async function (req, res) {
  var d = req.body;
  var img = new Date().getTime() + req.files.review_img.name;
  req.files.review_img.mv("public/img/" + img);
  var sql = `INSERT INTO review (review_img,review_name,review_info) VALUES('${img}','${d.review_name}','${d.review_info}')`;
  var data = await exec(sql);
  res.redirect("/admin/reviews");
});

route.get("/edit_review/:id", checkAdmin, async function (req, res) {
  var info = await exec(
    `SELECT * FROM review WHERE review_id = '${req.params.id}'`
  );
  res.render("admin/edit_review.ejs", { info: info[0] });
});

route.post("/update_review", checkAdmin, async function (req, res) {
  var d = req.body;
  if (req.files) {
    var img = new Date().getTime() + req.files.review_img.name;
    req.files.review_img.mv("public/img/" + img);
    await exec(
      `UPDATE review SET review_img = '${img}' WHERE review_id = '${d.review_id}'`
    );
  }
  await exec(
    `UPDATE review SET review_name='${d.review_name}',review_info='${d.review_info}' WHERE review_id = '${d.review_id}'`
  );
  res.redirect("/admin/reviews");
});

route.get("/delete_review/:id", checkAdmin, async function (req, res) {
  await exec(`DELETE FROM review WHERE review_id ="${req.params.id}"`);
  res.redirect("/admin/reviews");
});

route.get(
  "/change_appointment_status/:appointment_id/:new_status",
  checkAdmin,
  async function (req, res) {
    var sql = `UPDATE appointment SET status = '${req.params.new_status}' WHERE appointment_id = '${req.params.appointment_id}'`;
    var data = await exec(sql);
    // res.send(data);
    res.redirect("/admin/");
  }
);

module.exports = route;

// CREATE TABLE basic_information (basic_info_id INT PRIMARY KEY AUTO_INCREMENT,mobile VARCHAR(15),email_id VARCHAR(200),address VARCHAR(200),twitter_link VARCHAR(200),facebook_link VARCHAR(200),linkedin_link VARCHAR(200),instagram_link VARCHAR(200),map_link VARCHAR(200),heading VARCHAR(200));
// CREATE TABLE service_heading (service_heading_id INT PRIMARY KEY AUTO_INCREMENT,heading TEXT,before_img TEXT,after_img TEXT)
// CREATE TABLE service (service_id INT PRIMARY KEY AUTO_INCREMENT,service_name TEXT,service_img TEXT);
// CREATE TABLE doctor (doctor_id INT PRIMARY KEY AUTO_INCREMENT,doctor_name VARCHAR(100),doctor_mobile VARCHAR(15),doctor_email VARCHAR(200),Specialist VARCHAR(50),doctor_service_id INT,twitter_link TEXT,linkedin_link TEXT,facebook_link TEXT,instagram_link TEXT)
// CREATE TABLE review (review_id INT PRIMARY KEY AUTO_INCRMENT,review_img TEXT,review_name TEXT,review_info TEXT);
