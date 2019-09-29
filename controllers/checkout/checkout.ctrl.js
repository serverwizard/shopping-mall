const models = require('../../models');

const dotenv = require('dotenv');
dotenv.config(); // LOAD CONFIG

exports.index = (req, res) => {
    let totalAmount = 0; //총결제금액
    let cartList = {}; //장바구니 리스트
    //쿠키가 있는지 확인해서 뷰로 넘겨준다
    console.log('typeof req.cookies.cartList :' + req.cookies.cartList);
    if (typeof (req.cookies.cartList) !== 'undefined') {
        //장바구니데이터
        cartList = JSON.parse(unescape(req.cookies.cartList));

        //총가격을 더해서 전달해준다.
        for (const key in cartList) {
            totalAmount += parseInt(cartList[key].amount);
        }
    }
    res.render('checkout/index.html', {cartList, totalAmount});
};

exports.get_complete = async (req, res) => {

    // 모듈 선언
    const {Iamporter} = require('iamporter');
    const iamporter = new Iamporter({
        apiKey: process.env.IAMPORT_APIKEY,// 'REST API 키',
        secret: process.env.IAMPORT_SECRETCODE// 'REST API secret'
    });

    try {
        // RestAPI 로 Iamporter 가서 데이터를 조회해서 저장함 (보안성 강화)
        // 문서 참고: https://github.com/posquit0/node-iamporter
        const iamportData = await iamporter.findByImpUid(req.query.imp_uid);
        await models.Checkout.Create({
            imp_uid: iamportData.data.imp_uid,
            merchant_uid: iamportData.data.merchant_uid,
            paid_amount: iamportData.data.amount,
            apply_num: iamportData.data.apply_num,

            buyer_email: iamportData.data.buyer_email,
            buyer_name: iamportData.data.buyer_name,
            buyer_tel: iamportData.data.buyer_tel,
            buyer_addr: iamportData.data.buyer_addr,
            buyer_postcode: iamportData.data.buyer_postcode,

            status: "결재완료",
        });

        res.redirect('/checkout/success');
    } catch (e) {

    }
};

// 나중에 포스맨이용해서 다이렉트로 더미데이터 쌓을 때 사용할 것임
exports.post_complete = async (req, res) => {
    await models.Checkout.create(req.body);
    res.json({message: "success"});
};

exports.get_success = (req, res) => {
    res.render('checkout/success.html');
};

exports.get_nomember = (_, res) => {
    res.render('checkout/nomember.html');
};

exports.get_nomember_search = async (req, res) => {
    try {
        const checkouts = await models.Checkout.findAll({
            where: {
                buyer_email: req.query.buyer_email
            }
        });
        res.render('checkout/search.html', {checkouts});
    } catch (e) {
        console.log(e)
    }
};

exports.get_shipping = async (req, res) => {

    // 모듈선언
    const request = require('request-promise'); // request 모듈에서 async/await를 사용하기위한 모듈
    const cheerio = require('cheerio');

    try {

        //대한통운의 현재 배송위치 크롤링 주소
        const url = "https://www.doortodoor.co.kr/parcel/ \
        doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no=" + req.params.invc_no;
        let result = []; //최종 보내는 데이터

        const html = await request(url); // 해당 페이지 html 소스를 다 긁어옴
        const $ = cheerio.load(html,
            {decodeEntities: false} //한글 변환
        );

        const tdElements = $(".board_area").find("table.mb15 tbody tr td"); //td의 데이터를 전부 긁어온다
        // 아래 주석을 해제하고 콘솔에 찍어보세요.
        // 전체 data 를 먼저 찍어본다, 데이터 구조를 보기위해
        // console.log(tdElements);
        // 구조를보며 특정 필드값을 찍어본다. 이를 통해 규칙을 발견할 수 있다. 그리고 다음 row 부터는 계속 반복된다.
        // console.log(tdElements[0].children[0].data);

        //한 row가 4개의 칼럼으로 이루어져 있으므로
        // 4로 나눠서 각각의 줄을 저장한 한줄을 만든다
        let temp = {}; //임시로 한줄을 담을 변수
        for (let i = 0; i < tdElements.length; i++) {
            if (i % 4 === 0) {
                temp = {}; //시작 지점이니 초기화
                temp["step"] = tdElements[i].children[0].data.trim(); //공백제거
                //removeEmpty의 경우 step의 경우 공백이 많이 포함됨
            } else if (i % 4 === 1) {
                temp["date"] = tdElements[i].children[0].data;
            } else if (i % 4 === 2) {
                //여기는 children을 1,2한게 배송상태와 두번째줄의 경우 담당자의 이름 br로 나뉘어져있다.
                // 0번째는 배송상태, 1은 br, 2는 담당자 이름
                temp["status"] = tdElements[i].children[0].data;
                if (tdElements[i].children.length > 1) {
                    temp["status"] += tdElements[i].children[2].data;
                }
            } else if (i % 4 === 3) {
                temp["location"] = tdElements[i].children[1].children[0].data;
                result.push(temp); //한줄을 다 넣으면 result의 한줄을 푸시한다
            }
        }

        res.render('checkout/shipping.html', {result}); //최종값 전달
    } catch (e) {
        console.log(e)
    }
};