const express = require('express');
const router = express.Router();
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template');

router.get('/create', (req, res) => {
  var title = 'WEB - create';
  var list = template.list(req.list);
  var html = template.HTML(
    title,
    list,
    `
          <form action="/topic/create_process" method="post">
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

router.post('/create_process', (req, res) => {
  var post = req.body;
  var title = post.title;
  var description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
    res.redirect(`/topic/${title}`);
  });
});

router.get('/update/:pageId', (req, res) => {
  var filteredId = req.params.pageId;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    var title = req.params.pageId;
    var list = template.list(req.list);
    var html = template.HTML(
      title,
      list,
      `
            <form action="/topic/update_process" method="post">
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
      `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
    );
    res.send(html);
  });
});

router.post('/update_process', (req, res) => {
  var post = req.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function (error) {
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      res.redirect(`/topic/${title}`);
    });
  });
});

router.post('/delete_process/:pageId', (req, res) => {
  var filteredId = req.params.pageId;
  fs.unlink(`data/${filteredId}`, function (error) {
    res.redirect(`/`);
  });
});

router.get('/:pageId', (req, res, next) => {
  var filteredId = req.params.pageId;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    if (err) {
      next(err); //에러핸들러없이 이렇게만 하면 throw err랑 같음 에러핸들러 미들웨어가 있으면((인자가 4개인 미들웨어) 다음 미들웨어 무시하고 바로 에러핸들러로감
      return;
    }
    var title = req.params.pageId;
    var sanitizedTitle = sanitizeHtml(title);
    var sanitizedDescription = sanitizeHtml(description, {
      allowedTags: ['h1'],
    });
    var list = template.list(req.list);
    var html = template.HTML(
      sanitizedTitle,
      list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      ` <a href="/topic/create">create</a>
              <a href="/topic/update/${sanitizedTitle}">update</a>
              <form action="/topic/delete_process/${sanitizedTitle}" method="post">
                <input type="submit" value="delete">
              </form>`
    );
    res.send(html);
  });
});

module.exports = router;
