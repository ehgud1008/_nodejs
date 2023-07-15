
var conn = require("./db.js");
var template = require("./template.js");
var url = require("url");
var qs = require("querystring");

//여러 곳에서 사용하기 때문에 exports
exports.home = (request, response) => {
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
}

exports.detail = (request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
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


exports.create = (request, response) => {
    conn.query(`SELECT * FROM topic`, (error, topic) => {
        conn.query(`SELECT * FROM author`, (error2, author) => {
          var title = "Create";
          var list = template.list(topic);
          var html = template.HTML(title, list,
            `<form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              ${template.authorSelect(author)}
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
      })

}

exports.createProcess = (request, response) => {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
    request.on("end", function () {
      var post = qs.parse(body);
      conn.query(
        `INSERT INTO topic (title, description, created, author_id) VALUES (?,?, NOW(), ?);`,
        [post.title, post.description, post.author],
        (error, result) => {
          if(error){
            throw error;
          }
          response.writeHead(302, { Location: `/?id=${result.insertId}` });
          response.end();
        }
      )
    });
    
}

exports.update = (request, response) => {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;

    conn.query(`SELECT * FROM topic WHERE id = ?`, [queryData.id], (err, topic, fields) => {
        conn.query(`SELECT * FROM author`, (error, author) => {
          var title = "Update";
          var list = template.list(topic);
          var html = template.HTML(title, list,
            `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${topic[0].id}">
                  <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                  <p>
                    <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                  </p>
                  <p>
                    ${template.authorSelect(author, topic[0].author_id)}
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
          );
          response.writeHead(200);
          response.end(html);
        })
      });
}

exports.updateProcess = (request,response) => {
    var body = "";
    request.on("data", function (data) {
      body = body + data;
    });
     request.on("end", function () {
      var post = qs.parse(body);
      conn.query(
        `UPDATE topic SET title = ?, description = ?, author_id = ? WHERE id = ?`, [post.title, post.description, post.author, post.id], (error, result) => {
        if(error){
          throw error;
        }
        response.writeHead(302, { Location: `/?id=${post.id}` });
        response.end();
      })
    });
}

exports.delete = (request, response) => {
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
}