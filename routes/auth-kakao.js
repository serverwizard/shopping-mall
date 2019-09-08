const express = require('express');
const router = express.Router();

// passport-kakao 모듈이 토큰을 가지고, 카카오에서 정보를 가져오는 중간 과정을 자동으로 해줌
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const models = require('../models');

const dotenv = require('dotenv');
dotenv.config(); // LOAD CONFIG


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_APPID,
        clientSecret: process.env.KAKAO_SECRETCODE,
        callbackURL: `${process.env.SITE_DOMAIN}/auth/kakao/oauth`,
    },
    async (accessToken, refreshToken, profile, done) => {

        const username = `kakao_${profile.id}`;

        // 존재하는지 체크
        const exist = await models.User.count({
            where: {
                // 아이디로 조회를 해봅니다.
                username
            }
        });

        let user;
        if (!exist) {
            // 존재하면 바로 세션에 등록
            user = await models.User.create({
                username,
                displayname: profile.displayName,
                password: "kakao"
            });
        } else {
            user = await models.User.findOne({
                where: {
                    username
                }
            });
        }

        return done(null, user);
    }
));

router.get('/', passport.authenticate('kakao', {
    failureRedirect: '/accounts/login'
}));

router.get('/oauth', passport.authenticate('kakao', {
        successRedirect: '/',
        failureRedirect: '/accounts/login'
    })
);

module.exports = router;