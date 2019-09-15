// passport-github 모듈이 토큰을 가지고, 깃허브에서 정보를 가져오는 중간 과정을 자동으로 해줌
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const models = require('../models');

const dotenv = require('dotenv');
dotenv.config(); // LOAD CONFIG

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_APPID,
        clientSecret: process.env.GITHUB_SECRETCODE,
        callbackURL: `${process.env.SITE_DOMAIN}/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {

        const username = `gh_${profile.id}`;

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
                password: "github"
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

module.exports = passport;