const models = require('../../models');

exports.get_join = (req, res) => {
    res.render('accounts/join.html', {joinError: req.flash('joinError')});
};

exports.post_join = async (req, res) => {
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
};

exports.get_login = (req, res) => {
    res.render('accounts/login.html', {flashMessage: req.flash().error});
};

exports.post_login = (_, res) => {
    res.send('<script>alert("로그인 성공");location.href="/";</script>');
};

exports.get_success = (req, res) => {
    res.send(req.user);
};

exports.get_logout = async (req, res) => {
    let cartList = {}; // 장바구니 리스트
    // 회원이고, 쿠키에 장바구니가 있는 경우
    if (typeof req.cookies.cartList !== "undefined") {
        // 장바구니데이터
        cartList = JSON.parse(unescape(req.cookies.cartList));

        await models.Cart.destroy({
            where: {
                user_id: req.user.id
            }
        });

        const user = await models.User.findByPk(req.user.id);
        for (const key in cartList) {
            await user.createCart({
                product_id: key,
                number: cartList[key].number,
                amount: cartList[key].amount,
                thumbnail: cartList[key].thumbnail,
                name: cartList[key].name
            });
        }
    }
    res.clearCookie("cartList");
    // Terminate an existing login session.
    req.logout();
    res.redirect("/accounts/login");
};