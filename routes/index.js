const express = require('express');
const router = express.Router();
const template = require('../lib/template');

//app.get 메소드는 routing 역할을 함 (패스마다 어떤 적절한 응답을 할지)
//app.get -> application-level 미들웨어 app.use 는 바로 실행되고 app.get'*'은 get 메소드에사만 실행됨 app.post는 post 메소드에서만 실행
router.get('/', (req, res) => {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(req.list);
  var html = template.HTML(
    title,
    list,
    `
    <h2>${title}</h2>
    <div>
    <img src="/images/hello.jpg" style="width:600px;">
    <p>${description}</p>
    `,
    `<a href="/topic/create">create</a>`
  );
  res.send(html);
});

module.exports = router;
