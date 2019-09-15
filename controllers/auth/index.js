const {Router} = require('express');
const router = Router();
const ctrl = require('./auth.ctrl');

// passport-facebook 모듈이 토큰을 가지고, 페이스북에서 정보를 가져오는 중간 과정을 자동으로 해줌
const facebookPassport = require('../../config/facebookStrategy');
const githubPassport = require('../../config/githubStrategy');
const kakaoPassport = require('../../config/kakaoStrategy');

const dotenv = require('dotenv');
dotenv.config(); // LOAD CONFIG

<!-- facebook -->
// http://localhost:3000/auth/facebook 접근시 facebook으로 넘길 url 작성해줌
router.get('/facebook', facebookPassport.authenticate('facebook', {scope: 'email'}));
//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/facebook/callback',
    facebookPassport.authenticate('facebook',
        {
            successRedirect: '/',
            failureRedirect: '/auth/facebook/fail'
        }
    )
);
router.get('/facebook/success', ctrl.redirect_facebook_success);
router.get('/facebook/fail', ctrl.redirect_facebook_fail);

<!-- github -->
router.get('/github', githubPassport.authenticate('github'));

router.get('/github/callback',
    githubPassport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/accounts/login'
    })
);

<!-- kakao -->
router.get('/kakao', kakaoPassport.authenticate('kakao', {
    failureRedirect: '/accounts/login'
}));
router.get('/kakao/oauth', kakaoPassport.authenticate('kakao', {
        successRedirect: '/',
        failureRedirect: '/accounts/login'
    })
);

module.exports = router;