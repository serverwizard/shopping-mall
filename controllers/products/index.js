const express = require('express');
const router = express.Router();
const models = require('../../models');

const loginRequired = require('../../middleware/loginRequired');

router.get('/:id', async (req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.id);

        // 좋아요 내용을 가져온다
        const userLikes = await require('../../helpers/userLikes')(req);

        res.render('products/detail.html', {product, userLikes});
    } catch (e) {
        console.error(e);
    }
});

router.post('/like/:product_id(\\d+)', loginRequired, async (req, res) => {
    try {
        const product = await models.Products.findByPk(req.params.product_id);
        const user = await models.User.findByPk(req.user.id);

        const status = await user.addLikes(product);

        res.json({status});

    } catch (e) {
        console.log(e);
    }
});

module.exports = router;