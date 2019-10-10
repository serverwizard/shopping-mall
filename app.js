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

/**
 * 해당 파일에는 express 설정부분만 가짐
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

// db 관련
const db = require('./models');

// redis
// const client = require('./config/redis');
// const RedisStore = require('connect-redis')(session);

class App {

    constructor() {
        this.app = express();

        // db 접속
        this.dbConnection();

        // 뷰 템플릿 엔진 셋팅
        this.setViewEngine();

        // 세션 셋팅
        this.setSession();

        // 미들웨어 셋팅
        this.setMiddleWare();

        // 정적 디렉토리 추가
        this.setStatic();

        // 글로벌 변수 선언
        this.setLocals();

        // 라우팅
        this.getRouting();
    }

    dbConnection() {
        // TODO 로컬에서 개발할 때는 데이터베이스와 자동으로 싱크 맞추고 있음 (운영에서는 별도로 어떻게 가져갈 것인지)
        db.sequelize.authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
                // TODO 서버가 뜰 때, DB 테이블 자동으로 생성해줌
                // return db.sequelize.sync();
                // return db.sequelize.drop();
            })
            .then(() => {
                console.log('DB Sync complete.');
                // 더미 데이터가 필요하면 아래 설정
                // require('./config/insertDummyData')();
            })
            .catch(err => {
                console.error('Unable to connect to the database:', err);
            });
    }


    setMiddleWare() {
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(cookieParser());

        //passport(인증) 적용
        this.app.use(passport.initialize()); // authenticate 추가
        this.app.use(passport.session());

        //플래시 메시지 관련
        this.app.use(flash());
    }

    setViewEngine() {
        /**
         * 템플릿 엔진 셋팅
         */
        nunjucks.configure('template', {
            autoescape: true,
            express: this.app
        });
    }


    setSession() {
        const SequelizeStore = require('connect-session-sequelize')(session.Store);

        //session 관련 셋팅
        this.app.sessionMiddleWare = session({
            secret: 'fastcampus',
            resave: false,
            saveUninitialized: true,
            name: 'sessionId',
            cookie: {
                maxAge: 2000 * 60 * 60, //지속시간 2시간
                httpOnly: true,
                secure: false,
            },
            // store: new RedisStore({client}),
            store: new SequelizeStore({
                db: db.sequelize,
            }),
        });

        // 대부분의 미들웨어들이 request의 변수를 추가하는 꼴로 동작 (request.session)
        this.app.use(this.app.sessionMiddleWare);
    }


    setStatic() {
        // '/uploads': 웹 URL, express.static('uploads'): 폴더 위치
        // static 폴더 위치 설정
        this.app.use('/uploads', express.static('uploads'));
        this.app.use('/static', express.static('static'));
    }

    // 뷰로 쏴줄 데이터 셋팅
    setLocals() {
        this.app.use((req, _, next) => {
            // 로그인 여부를 전달함, 해당 미들웨어는 모든 router 위에 두어야 에러가 안난다
            // 이렇게하면 라우터마다 isLogin 변수를 안내려줘도 됨
            // 글로벌 변수를 선언하는 방법
            this.app.locals.isLogin = req.isAuthenticated();
            // 현재 URL을 템플릿쪽 변수로 쏴준다
            this.app.locals.req_path = req.path;

            //app.locals.urlparameter = req.url; //현재 url 정보를 보내고 싶으면 이와같이 셋팅
            //app.locals.userData = req.user; //사용 정보를 보내고 싶으면 이와같이 셋팅

            this.app.locals.req_user = req.user;

            // 검색창에 입력한 검색어 출력을 위해 선언
            this.app.locals.req_query = req.query;

            next();
        });
    }

    getRouting() {
        this.app.use(require('./controllers'));
    }
}

module.exports = new App().app;