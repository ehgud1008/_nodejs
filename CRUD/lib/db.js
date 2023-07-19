var mysql = require("mysql");
var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1q2w3e4r!Q@W#E$R",
    database: "nodejs",
  });
  conn.connect();

  //외부로 꺼낼 API가 하나라면
module.exports = conn;
  //여러개의 API를 꺼내서 사용할거라면
  //exports