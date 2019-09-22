const models = require('../models');

module.exports = async (req, res, next) => {
    try {
        let cartList = {}; // 장바구니 리스트
        // 비회원일 때, 쿠키에 장바구니가 있는 경우
        if (typeof req.cookies.cartList !== "undefined") {
            // 장바구니데이터
            cartList = JSON.parse(unescape(req.cookies.cartList));
            const cart = await models.Cart.findAll({
                where: {
                    user_id: req.user.id
                }
            });

            for (let i = 0; i < cart.length; i++) {
                if (cartList[cart[i].product_id]) {
                    if (cart[i].number !== cartList[cart[i].product_id].number) {
                        cart[i].number = parseInt(cart[i].number) + parseInt(cartList[cart[i].product_id].number);
                        cart[i].amount = (parseInt(cartList[cart[i].product_id].amount) / parseInt(cartList[cart[i].product_id].number)) * parseInt(cart[i].number);
                    }
                }

                cartList[cart[i].product_id] = {
                    number: cart[i].number,
                    amount: cart[i].amount,
                    thumbnail: cart[i].thumbnail,
                    name: cart[i].name
                };
            }
            res.clearCookie("cartList");
            res.cookie("cartList", JSON.stringify(cartList), {
                maxAge: 3600 * 1000 * 3
            });

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
        // 비회원일 때, 쿠키에 장바구니가 없는 경우
        else {
            const cart = await models.Cart.findAll({
                where: {
                    user_id: req.user.id
                }
            });
            for (let i = 0; i < cart.length; i += 1) {
                cartList[cart[i].product_id] = {
                    number: cart[i].number,
                    amount: cart[i].amount,
                    thumbnail: cart[i].thumbnail,
                    name: cart[i].name
                };
            }
            res.cookie("cartList", JSON.stringify(cartList), {
                maxAge: 3600 * 1000 * 3
            });
        }
        next();
    } catch (e) {
        console.log(e);
    }
};