var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var template = require("./lib/template.js");
var path = require("path");
var sanitizeHtml = require("sanitize-html");
var mysql = require("mysql");
const { throws } = require("assert");
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1q2w3e4r!Q@W#E$R",
  database: "nodejs",
});
conn.connect();

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      
      /* fs.readdir("./data", function (error, filelist) {
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = template.list(filelist);
        var html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      }); */
      conn.query(`SELECT * FROM topic`, (err, results, fields) => {
        console.log(results);
        var title = "Welcome";
        var description = "Hello, Node.js";
        var list = template.list(results);
        var html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      conn.query(`SELECT * FROM topic`, (err, results) => {
        if (err) {
          throw err;
        }
        conn.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ?`, [queryData.id], (err2, result) => {
          if(err2){
            throw err2;
          }
            console.log(result);
            var title = result[0].title;
            var description = result[0].description;
            var list = template.list(results);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>
              by ${result[0].name}
              ${description}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          }
        );
      });
    }
  } else if (pathname === "/create") {
    conn.query(`SELECT * FROM topic`, (err, results, fields) => {
      console.log(results);
      var title = "Create";
      var list = template.list(results);
      var html = template.HTML(title, list,
        `<form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>`,
      `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      conn.query(
        `INSERT INTO topic (title, description, created, author_id) VALUES (?,?, NOW(), ?);`,
        [post.title, post.description, 1],
        (error, result) => {
          if(error){
            throw error;
          }
          response.writeHead(302, { Location: `/?id=${result.insertId}` });
          response.end();
        }
      )
    });
    

  } else if (pathname === "/update") {
    conn.query(`SELECT * FROM topic WHERE id = ?`, [queryData.id], (err, results, fields) => {
      var title = "Update";
      var list = template.list(results);
      var html = template.HTML(title, list,
        `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${results[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${results[0].title}"></p>
              <p>
                <textarea name="description" placeholder="description">${results[0].description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/update_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
     request.on("end", function () {
      var post = qs.parse(body);
      conn.query(
        `UPDATE topic SET title = ?, description = ? WHERE id = ?`, [post.title, post.description, post.id], (error, result) => {
        if(error){
          throw error;
        }
        response.writeHead(302, { Location: `/?id=${post.id}` });
        response.end();
      })
    });
  } else if (pathname === "/delete_process") {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      conn.query(
        `DELETE FROM topic WHERE id = ?`, [post.id], (error, result) => {
        if(error){
          throw error;
        }
        response.writeHead(302, { Location: `/` });
        response.end();
      })
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
