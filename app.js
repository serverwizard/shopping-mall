/**
 * npm start, npm test를 제외하고,
 * 나머지는 npm run dev 처럼 중간에 run을 붙여줘야 함
 *
 * nodemon을 설치해줬는데, 이는 서버에 변화가 있을 때
 * 자동으로 서버를 내렸다 올려주기 위해서
 *
 * npx는 글로벌 모듈을 자기가 직접 다운받고 실행시켜줌
 * 소스코드를 줄 때 어떤 글로벌 모듈이 필요하다는 것을
 * 안 알려줘도 된다
 *
 * 우리가 만든 app을 오버라이딩 시키지 않기 위해, router를 만들어서 export 시켜준거다
 * app을 export 해줘도 되는데, 그럼 app이 오버라이딩 되서 덮어씌워진다.
 *
 */

const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const bodyParser = require('body-parser');

// db 관련
const db = require('./models');

// TODO 로컬에서 개발할 때는 데이터베이스와 자동으로 싱크 맞추고 있음 (운영에서는 별도로 어떻게 가져갈 것인지)
db.sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');

        // TODO DB에 테이블 자동으로 생성해줌
        return db.sequelize.sync();
    })
    .then(() => {
        console.log('DB Sync complete.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const admin = require('./routes/admin');

const app = express();
const port = 3000;

/**
 * 템플릿 엔진 셋팅
 */
nunjucks.configure('template', {
    autoescape: true,
    express: app
});

/**
 * 미들웨어 사용 부분
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/admin', admin);

app.get('/', (_, res) => {
    res.send('express framework');
});

// app.get('/admin', (req, res) => {
//    res.send('admin page');
// });

app.listen(port, () => {
    console.log('Express listening on port', port);
});
