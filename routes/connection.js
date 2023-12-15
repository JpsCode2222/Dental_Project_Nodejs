var mysql = require("mysql");
var util = require("util");

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dentcare_hospital_nodejs",
});

var exec = util.promisify(conn.query).bind(conn);

module.exports = exec;
