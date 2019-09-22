//로그인 성공시 이동할 주소
exports.redirect_facebook_success = (req, res) => {
    // res.send(req.user);
    res.redirect('/admin/products')
};

exports.redirect_facebook_fail = (req, res) => {
    res.send('facebook login fail');
};

exports.redirect_success = (req, res) => {
    res.redirect('/')
};