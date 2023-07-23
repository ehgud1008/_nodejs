const express = require('express');
const router = express.Router();

const path = require('path');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const qs = require('querystring');

var template = require('../lib/template.js');
const bodyParser = require('body-parser');
const compression = require('compression');

//queryString이 아닌 path 방식
/* app.get('/page/:pageId', (request, response) => {
  console.log(request.params);
  response.send(request.params)
}); */
router.get('/page/:pageId', (request, response, next) => {
    fs.readdir('./data', function(error, filelist){
      var filteredId = path.parse(request.params.pageId).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        if(err){
          next(err);
        }else{
          var title = request.params.pageId;
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
            allowedTags:['h1']
          });
          var list = template.list(request.list);
          var html = template.HTML(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            ` <a href="/create">create</a>
              <a href="/update/${sanitizedTitle}">update</a>
              <form action="/delete" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`
          );
          response.send(html);
        }
      }); 
    });
  });
  
  router.get('/create', (request, response) => {
    fs.readdir('./data', function(error, filelist){
      var title = 'WEB - create';
      var list = template.list(request.list);
      var html = template.HTML(title, list, `
        <form action="/create" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '');
      response.send(html);
    });
  });
  
  router.post('/create', (request, response) => {
    //bodyParser라는 미들웨어를 사용하여 자동으로 객체화함
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.writeHead(302, {Location: `/?id=${title}`});
      response.end();
    })
  
    /* var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
    }); */
  });
  
  router.get('/update/:title', (request, response) => {
    fs.readdir('./data', function(error, filelist){
      var filteredId = path.parse(request.params.title).base;
      console.log(filteredId);
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var title = request.params.title;
        var list = template.list(request.list);
        var html = template.HTML(title, list,
          `
          <form action="/update" method="post">
            <input type="hidden" name="id" value="${title}">
            <p><input type="text" name="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update/${title}">update</a>`
        );
        response.send(html);
      });
    });
  });
  
  router.post('/update', (request, response) => {
      var post = request.body;
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
        })
      });
  });
  
  router.post('/delete', (request, response) =>{
      var post = request.body;
      var filteredId = path.parse(post.id).base;
      fs.unlink(`data/${filteredId}`, function(error){
        response.redirect('/');
      })
  });
  
  module.exports = router;