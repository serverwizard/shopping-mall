const express = require('express');
const router = express.Router();

const models = require('../models');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('../helpers/passwordHash');

// Registers a function used to serialize user objects into the session. (로그인 할 때, 딱 한번만)
passport.serializeUser((user, done) => { // callback 함수가 실행됨, Strategy 성공 시 호출됨
    console.log('serializeUser');
    done(null, user);
});

// Registers a function used to deserialize user objects out of the session. (페이지 조회할 때마다 계속 호출)
passport.deserializeUser((user, done) => {
    const result = user;
    result.password = "";
    console.log('deserializeUser');
    done(null, result);
});

passport.use(new LocalStrategy({
        usernameField: 'username', // input의 name명과 일치해야 함
        passwordField: 'password', // input의 name명과 일치해야 함
        passReqToCallback: true
    },
    async (req, username, password, done) => {
        console.log('LocalStrategy 정책 설정');
        // 조회
        const user = await models.User.findOne({
            where: {
                username,
                password: passwordHash(password),
            },
            // json 응답 값 뿌려줄 때, exclude
            // 내가 보여주고 싶은 필드만 선언
            attributes: {exclude: ['password']}
        });
        // 유저에서 조회되지 않을시
        if (!user) {
            return done(null, false, {message: '일치하는 아이디 패스워드가 존재하지 않습니다.'});

            // 유저에서 조회 되면 세션등록쪽으로 데이터를 넘김 (세션으로 넘길 데이터)
        } else {
            console.log('user : ' + user);
            console.log('user.dataValues : ' + user.dataValues);

            return done(null, user.dataValues);
        }
    }
));

router.get('/', (_, res) => {
    res.send('account app');
});

router.get('/join', (req, res) => {
    res.render('accounts/join.html', {joinError: req.flash('joinError')});
});

router.post('/join', async (req, res) => {
    // 회원가입 여부 확인
    let savedUser = await models.User.findOne({
        where: {
            username: req.body.username
        }
    });

    if (savedUser) {
        req.flash('joinError', '이미 회원가입된 이메일입니다.');
        return res.redirect('/accounts/join');
    }

    await models.User.create(req.body);
    res.send('<script>alert("회원가입 성공");location.href="/accounts/login";</script>');

});

router.get('/login', (req, res) => {
    res.render('accounts/login.html', {flashMessage: req.flash().error});
});

// passport-facebook 인증도 비슷함
router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/accounts/login',
        failureFlash: true
    }),
    (_, res) => {
        res.send('<script>alert("로그인 성공");location.href="/";</script>');
    }
);

router.get('/success', (req, res) => {

    res.send(req.user);
});


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/accounts/login');
});

module.exports = router;
