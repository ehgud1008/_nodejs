//버전관리 시 개방환경을 세팅할 경우 이 파일을 복사하여 db.js 파일을 만들고 실제 서비스에서 사용
var mysql = require("mysql");
var conn = mysql.createConnection({
    host: "",
    user: "",
    password: "",
    database: "",
  });
  conn.connect();

  //외부로 꺼낼 API가 하나라면
module.exports = conn;
  //여러개의 API를 꺼내서 사용할거라면
  //exports