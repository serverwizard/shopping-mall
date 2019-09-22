exports.index = (req, res) => {
    let totalAmount = 0; //총결제금액
    let cartList = {}; //장바구니 리스트
    //쿠키가 있는지 확인해서 뷰로 넘겨준다
    if (typeof (req.cookies.cartList) !== 'undefined') {
        //장바구니데이터
        // "4":{"number":"1","amount":"10000011","thumbnail":"products-1568566269437.jpeg","name":"정말 좋나요?11"},
        // "6":{"number":"1","amount":"1000","thumbnail":"products-15688922183g","name":"테스트 상품"}}
        cartList = JSON.parse(unescape(req.cookies.cartList));
        //총가격을 더해서 전달해준다.
        for (const key in cartList) {
            totalAmount += parseInt(cartList[key].amount);
        }
    }
    res.render('cart/index.html', {cartList, totalAmount});
};

exports.post_cart = (req, res) => {
    res.json('장바구니에 담았습니다.');
};