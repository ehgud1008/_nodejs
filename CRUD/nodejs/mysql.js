var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1q2w3e4r!Q@W#E$R",
  database: "nodejs",
});

connection.connect();

connection.query("SELECT * FROM topic", function (error, results, fields) {
  if (error) {
    console.log(error);
    //throw error;
  }
  console.log(results);
});

connection.end();
