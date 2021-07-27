const express = require('express');
const app = express(); //express 함수의 리턴값을 app에 할당
const port = 3000;
const fs = require('fs');
const compression = require('compression');
const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');

app.use(express.static('public')); //정적인 파일을 서비스하고자 하는 디렉토리를 지정
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.get('*', (req, res, next) => {
  fs.readdir('./data', function (error, filelist) {
    req.list = filelist;
    next(); //next()를 씀으로써 그 다음 미들웨어를 호출할지를 이전 미들웨어에서 결정
  });
});

app.use('/', indexRouter);
app.use('/topic', topicRouter);
//topic으로 시작하는 주소들에게 topicRouter 미들웨어를 적용하겠다

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

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
