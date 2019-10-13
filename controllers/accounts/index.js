const {Router} = require('express');
const router = Router();
const ctrl = require('./accounts.ctrl');

const models = require('../../models');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('../../helpers/passwordHash');

const userCart = require('../../middleware/userCart');

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
        } else if (user.status == "이메일미인증") { // 이메일 인증이 되지 않을시
            return done(null, false, {message: `이메일 인증을 진행해주세요.( <a href=/accounts/join/resend?email=${username}>인증 메일 재전송</a> )`});
        } else { // 이메일 인증되면 세션등록쪽으로 데이터를 넘김 (세션으로 넘길 데이터)
            console.log('user : ' + user);
            console.log('user.dataValues : ' + user.dataValues);

            return done(null, user.dataValues);
        }
    }
));

router.get('/join', ctrl.get_join);
router.post('/join', ctrl.post_join);
router.get('/login', ctrl.get_login);
router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/accounts/login',
        failureFlash: true
    }), userCart, ctrl.post_login);
router.get('/success', ctrl.get_success);
router.get('/logout', ctrl.get_logout);

// 이메일 인증하라고 알려주는 페이지
router.get('/join/check', ctrl.join_check);

// 사용자가 이메일 인증시 validation 처리
router.get('/join/validate', ctrl.join_validate);

// 인증 이메일 전송
router.post('/join/send', ctrl.join_send);

// 이메일 인증을 재전송하는 페이지
router.get('/join/resend', ctrl.join_resend);

module.exports = router;