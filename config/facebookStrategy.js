const models = require('../models');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

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

            let user;
            if (!exist) {
                // 존재하면 바로 세션에 등록
                // TODO OAuth 2.0 을 이용할 때는,
                //  주로 이런식으로 인증을 거치고 디비에 저장함
                //  그래야만 나중에 회원 집계도 할수 있고, 그래야만 우리서비스에서 사용자 정보도 수정할 수 있음
                //  User 테이블에 user_type을 컬럼을 둬서 email/facebook/ 이런식으로 구별함
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

module.exports = passport;
