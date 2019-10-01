const getCookie = cname => {
    let name = cname + "=";
    // 암호화된 URI 해독
    console.log('document.cookie : ' + document.cookie);
    let decodedCookie = decodeURIComponent(unescape(document.cookie));
    console.log('decodedCookie : ' + decodedCookie);
    // cartList={"1":{"number":"1","amount":"1000000000","thumbnail":"products-1568121079438.jpeg","name":"맥북"}}
    let ca = decodedCookie.split(';');
    console.log('decodedCookie.split(";") : ' + ca);
    // cartList={"1":{"number":"1","amount":"1000000000","thumbnail":"products-1568121079438.jpeg","name":"맥북"}}

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

const setCookieHour = (name, value, hours) => {
    let now = new Date();
    let time = now.getTime();
    time += 3600 * 1000 * hours;
    now.setTime(time);
    document.cookie = name + "=" + escape(value) + "; path=/; expires=" + now.toUTCString() + ";"
};

$(document).on('click', '.add_like', function (e) {
    // 주소에 # 붙는것 방지
    e.preventDefault();

    // 부모 요소의 아이디를 가져온다.
    var target_id = $(this).parent().attr('id');

    // 현재 제품의 id 받아옴
    var product_id = $(this).attr('product_id');

    $.ajax({
        url: '/products/like/' + product_id,
        type: 'post',
    })
        .done(function () {

            $('#' + target_id).html('\
            <a product_id="' + product_id + '" class="pull-right remove_like" href="#"> \
                <img src="/static/img/likeon.png" width="20" alt=""> \
            </a> \
        ');

        })
        .fail(function () {
            console.log('오류발생');
        })
});

$(document).on('click', '.remove_like', function (e) {
    // 주소에 # 붙는것 방지
    e.preventDefault();

    // 부모 요소의 아이디를 가져온다.
    var target_id = $(this).parent().attr('id');

    // 현재 제품의 id 받아옴
    var product_id = $(this).attr('product_id');

    $.ajax({
        url: '/products/like/' + product_id,
        type: 'delete',
    })
        .done(function () {

            $('#' + target_id).html('\
            <a product_id="' + product_id + '" class="pull-right add_like" href="#"> \
                <img src="/static/img/likeoff.png" width="20" alt=""> \
            </a> \
        ');

        })
        .fail(function () {
            console.log('오류발생');
        })
});