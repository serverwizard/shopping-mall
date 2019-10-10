const express = require('express');
const router = express.Router();
const models = require('../../models');

const loginRequired = require('../../middleware/loginRequired');

router.get('/:id', async (req, res) => {
    try {
        const product = await models.Products.findOne({
            where: {id: req.params.id},
            include: [
                {model: models.Tag, as: 'Tag'}
            ],
            // Product 안에있는 Tag들을 orderBy
            order: [
                ['Tag', 'createdAt', 'desc']
            ]
        });

        // 좋아요 내용을 가져온다
        const userLikes = await require('../../helpers/userLikes')(req);

        res.render('products/detail.html', {product, userLikes});
    } catch (e) {
        console.error(e);
    }
});

// 정규식으로 숫자만 받고 싶을때 사용하는 방법
router.post('/like/:product_id(\\d+)', loginRequired, async (req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.product_id);
        const user = await models.User.findByPk(req.user.id);

        // Many To Many 저장하는 방법
        // 중복이 발생하면 자동적으로 막아줌
        const status = await user.addLikes(product);

        res.json({status});

    } catch (e) {
        console.log(e);
    }
});

router.delete('/like/:product_id(\\d+)', loginRequired, async (req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.product_id);
        const user = await models.User.findByPk(req.user.id);

        await user.removeLikes(product);

        res.json({
            message: "success"
        });
    } catch (e) {

    }
});

module.exports = router;