exports.get_chat_page = (req, res) => {
    if (!req.isAuthenticated()) {
        res.send('<script>alert("로그인이 필요한 서비스입니다.");\
        location.href="/accounts/login";</script>');
    } else {
        res.render('chat/index.html');
    }
};

exports.redirect_facebook_fail = (req, res) => {
    res.send('facebook login fail');
};
