const express = require('express');
const app = express();

const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const qs = require('querystring');

const bodyParser = require('body-parser');
const compression = require('compression');

const helmet = require('helmet');
app.use(helmet());

var topicRouter = require('./routes/topic.js');
var homeRouter = require('./routes/home.js');
//정적인 파일을 서비스할 때 사용 => url을 통해서 사용 가능 /public/images/~~
//public 외의 다른 부분은 접근 불가능
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended : false }));
app.use(compression());
app.use(function (request, response, next){
  fs.readdir('./data', function(error, filelist){
    //request에 list라는 이름으로 filelist 사용
    request.list = filelist;
    next();
  });
})

// 명시한 접근을 처리(RequestMapping 같은거 인듯)
app.use('/', homeRouter);
app.use('/topic', topicRouter);

app.use(topicRouter)

//404 예외처리
app.use(function (request, response, next){
  response.status(404).send("Sorry, can not find page!");
});

//err 처리 화면
app.use(function (error, request, response, next){
  console.log(error);
  response.status(500).send("Something broke!");
});

app.listen(3000, () => console.log('Example app listening on port 3000'));
