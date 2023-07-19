var http = require("http");
var url = require("url");
var qs = require("querystring");
var template = require("./lib/template.js");
var conn = require("./lib/db.js");
var topic = require("./lib/topic");

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      topic.home(request, response);
    } else {
      topic.detail(request, response);
    }
  } else if (pathname === "/create") {
    topic.create(request, response);
  } else if (pathname === "/create_process") {
    topic.createProcess(request, response);

  } else if (pathname === "/update") {
    topic.update(request,response);
  } else if (pathname === "/update_process") {
    topic.updateProcess(request,response);
  } else if (pathname === "/delete_process") {
    topic.delete(request, response);
  } else if (pathname === "/authorList"){
    topic.authorList(request, response);
  } else if (pathname === "/authorDelete") {
    topic.authorDelete(request, response);
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
