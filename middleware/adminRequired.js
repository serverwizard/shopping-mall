module.exports = function (req, res, next) {
    // 로그인이 안되어있으면 로그인 페이지로
    if (!req.isAuthenticated()) {
        res.redirect('/accounts/login');
    } else {
        // 로그인 되어 있으면 아이디가 admin 인지 체크
        if (req.user.username !== 'admin') {
            res.send('<script>alert("관리자만 접근가능합니다.");\
            location.href="/accounts/login";</script>');
        } else {
            return next();
        }
    }
};