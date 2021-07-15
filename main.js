const express = require('express');
const app = express(); //express 함수의 리턴값을 app에 할당
const port = 3000;
var fs = require('fs');
var template = require('./lib/template.js');
var qs = require('querystring');
// var path = require('path');
var sanitizeHtml = require('sanitize-html');

//app.get 메소드는 routing 역할을 함 (패스마다 어떤 적절한 응답을 할지)
app.get('/', (req, res) => {
  fs.readdir('./data', function (error, filelist) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    res.send(html);
  });
});

app.get('/page/:pageId', (req, res) => {
  fs.readdir('./data', function (error, filelist) {
    var filteredId = req.params.pageId;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      var title = req.params.pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ['h1'],
      });
      var list = template.list(filelist);
      var html = template.HTML(
        sanitizedTitle,
        list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
              <a href="/update/${sanitizedTitle}">update</a>
              <form action="/delete_process/${sanitizedTitle}" method="post">
                <input type="submit" value="delete">
              </form>`
      );
      res.send(html);
    });
  });
});

app.get('/create', (req, res) => {
  fs.readdir('./data', function (error, filelist) {
    var title = 'WEB - create';
    var list = template.list(filelist);
    var html = template.HTML(
      title,
      list,
      `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `,
      ''
    );
    res.send(html);
  });
});

app.post('/create_process', (req, res) => {
  var body = '';
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    var post = qs.parse(body);
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      res.redirect(`/page/${title}`);
    });
  });
});

app.get('/update/:pageId', (req, res) => {
  fs.readdir('./data', function (error, filelist) {
    var filteredId = req.params.pageId;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      var title = req.params.pageId;
      var list = template.list(filelist);
      var html = template.HTML(
        title,
        list,
        `
            <form action="/update_process" method="post">
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
      res.send(html);
    });
  });
});

app.post('/update_process', (req, res) => {
  var body = '';
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    var post = qs.parse(body);
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        res.redirect(`/page/${title}`);
      });
    });
  });
});

app.post('/delete_process/:pageId', (req, res) => {
  var body = '';
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    // var post = qs.parse(body);
    // var id = post.id;
    var filteredId = req.params.pageId;
    fs.unlink(`data/${filteredId}`, function (error) {
      res.redirect(`/`);
    });
  });
});

app.get('/dopil', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>도필</title>
</head>
<body>
<h1>도필<h1>
<p>
 <img src="https://pbs.twimg.com/media/EMSH041UEAEonlM.jpg" width="500px">
</p>
</body>
</html>`;
  res.send(html);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

/*
var http = require('http');
var fs = require('fs');
var url = require('url');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        
        });
      } else {
      
    } else if(pathname === '/create'){
    } else if(pathname === '/create_process'){
    } else if(pathname === '/update'){
    } else if(pathname === '/update_process'){
    } else if(pathname === '/delete_process'){
      
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/
