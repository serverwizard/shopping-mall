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

/**
 * redis 에 세션을 체크하는 미들웨어
 * css, js인 정적 파일을 S3에 저장하는 이유: 서버 부하 줄여줌 (요청 최소화)
 */
const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//flash  메시지
const flash = require('connect-flash');

//passport 로그인
const passport = require('passport');
const session = require('express-session');

// redis
const client = require('./config/redis');
const RedisStore = require('connect-redis')(session);

// db 관련
const db = require('./models');

// TODO 로컬에서 개발할 때는 데이터베이스와 자동으로 싱크 맞추고 있음 (운영에서는 별도로 어떻게 가져갈 것인지)
db.sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');

        // return db.sequelize.drop();
        // TODO 서버가 뜰 때, DB 테이블 자동으로 생성해줌
        return db.sequelize.sync();
    })
    .then(() => {
        console.log('DB Sync complete.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const admin = require('./routes/admin');
const contacts = require('./routes/contacts');
const accounts = require('./routes/accounts');
const auth = require('./routes/auth');
const githubAuth = require('./routes/github-auth');

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
app.use(cookieParser());

// '/uploads': 웹 URL, express.static('uploads'): 폴더 위치
// static 폴더 위치 설정
app.use('/uploads', express.static('uploads'));

//session 관련 셋팅
const sess = {
    secret: 'fastcampus',
    resave: false,
    // saveUninitialized: true,
    name: 'sessionId',
    cookie: {
        maxAge: 2000 * 60 * 60, //지속시간 2시간
        httpOnly: true,
        secure: false,
    },
    store: new RedisStore({client}),
};

//passport(인증) 적용
app.use(session(sess)); // 대부분의 미들웨어들이 request의 변수를 추가하는 꼴로 동작 (request.session)
app.use(passport.initialize()); // authenticate 추가
app.use(passport.session(sess));

//플래시 메시지 관련
app.use(flash());

// 세션 검사 미들웨어
const sessionChecker = require('./middleware/session');
// 세션 검사
app.use(sessionChecker);


// 모든 라우터에 적용할 미드웨어 설정
app.use('/admin', admin);
app.use('/contacts', contacts);
app.use('/accounts', accounts);
app.use('/auth/github', githubAuth);
app.use('/auth', auth);

app.get('/', (_, res) => {
    res.send('dashboard');
});

app.listen(port, () => {
    console.log('Express listening on port', port);
});
