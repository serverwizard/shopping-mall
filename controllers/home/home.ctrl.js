const models = require('../../models');

exports.index = async (req, res) => {
    const products = await models.Products.findAll({
        include: [
            {
                model: models.User,
                as: 'Owner',
                attributes: ['username', 'displayname']
            },
        ]
    });

    // 좋아요 내용을 가져온다
    const userLikes = await require('../../helpers/userLikes')(req);

    // console.log(models.Products.findAll())
    res.render('home.html', {products, userLikes});
};
