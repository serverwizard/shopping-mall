const express = require('express');
const router = express.Router();

// passport-facebook 모듈이 토큰을 가지고, 페이스북에서 정보를 가져오는 중간 과정을 자동으로 해줌
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const models = require('../models');

const dotenv = require('dotenv');
dotenv.config(); // LOAD CONFIG

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// TODO 구글 OAuth 인증 구현
// TODO 정책 작성하는 부분
passport.use(new FacebookStrategy({
        // https://developers.facebook.com에서 appId 및 scretID 발급
        clientID: process.env.FACEBOOK_APPID, //입력하세요
        clientSecret: process.env.FACEBOOK_SECRETCODE, //입력하세요.
        callbackURL: `${process.env.SITE_DOMAIN}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열
    },
    async (accessToken, refreshToken, profile, done) => {

        //아래 하나씩 찍어보면서 데이터를 참고해주세요.
        //console.log(accessToken);
        console.log(profile);
        //console.log(profile.displayName);
        //console.log(profile.emails[0].value);
        //console.log(profile._raw);
        //console.log(profile._json);

        try {
            const username = `fb_${profile.id}`;

            // 존재하는지 체크
            const exist = await models.User.count({
                where: {
                    // 아이디로 조회를 해봅니다.
                    username
                }
            });

            if (!exist) {
                // 존재하면 바로 세션에 등록
                user = await models.User.create({
                    username,
                    displayname: profile.displayName,
                    password: "facebook"
                });
            } else {
                user = await models.User.findOne({
                    where: {
                        username
                    }
                });
            }

            return done(null, user);

        } catch (e) {
            console.log(e);
        }

    }
));

// http://localhost:3000/auth/facebook 접근시 facebook으로 넘길 url 작성해줌
router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/facebook/callback',
    passport.authenticate('facebook',
        {
            successRedirect: '/auth/facebook/success',
            failureRedirect: '/auth/facebook/fail'
        }
    )
);

//로그인 성공시 이동할 주소
router.get('/facebook/success', (req, res) => {
    // res.send(req.user);
    res.redirect('/admin/products')
});

router.get('/facebook/fail', (req, res) => {
    res.send('facebook login fail');
});


module.exports = router;