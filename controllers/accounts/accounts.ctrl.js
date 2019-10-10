const models = require('../../models');

exports.get_join = (req, res) => {
    res.render('accounts/join.html', {joinError: req.flash('joinError')});
};

exports.post_join = async (req, res) => {
    // 환경 설정 변수 관련
    const dotenv = require('dotenv');
    dotenv.config(); // LOAD CONFIG

    try {
        // body 데이터 삽입
        const user = await models.User.create({
            username: req.body.username,
            displayname: req.body.displayname,
            password: req.body.password,
            status: "이메일미인증" // 이메일 미인증 상태
        });

        // 인증키 생성후 DB 삽입
        const hash_key = require('../../helpers/genKey')(user.id);

        await models.EmailKey.create({
            hash_key,
            user_id: user.id
        });

        // 인증 메일 발송
        const template = require('../../helpers/email/joinTemplate');
        const sigin_up_url = `${process.env.SITE_DOMAIN}/accounts/join/validate?hash_key=${hash_key}`;

        await require('../../helpers/email/sendMail')({
            to: user.username,
            subject: "serverwizard 노드쇼핑몰 가입 인증메일 입니다.",
            mail_body: template(sigin_up_url)
        });

        res.redirect(`/accounts/join/check?email=${user.username}`);

    } catch (e) {
        console.log(e)
        res.send('<script> \
            alert("양식에 맞게 작성해주세요. 또는 관리자에게 문의해주세요."); \
            history.go(-1); \
        </script>')
    }
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

exports.join_check = (req, res) => {
    res.render('accounts/email_check.html', {email: req.query.email});
};

exports.join_validate = async (req, res) => {
    try {
        // 인증키에 일치하는 아이디 조회
        const active = await models.EmailKey.findOne({
            where: {
                hash_key: req.query.hash_key
            }
        });

        if (!active) {
            // 존재하지 않는 키값일시 또는 실수로 상단 주소를 지웠을 경우
            return require('../../helpers/show404template')(res);
        }

        // 사용자 상태를 이메일 인증으로 바꾼다
        await models.User.update({
            status: "이메일인증완료"
        }, {
            where: {id: active.user_id}
        });

        const user = await models.User.findByPk(active.user_id);

        res.render('accounts/email_active.html', {email: user.username});

    } catch (e) {

    }
};