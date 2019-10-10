const models = require('../../models');

exports.index = async (req, res) => {
    const products = await models.Products.findAll({
        include: [
            'LikeUser',
            {
                model: models.User,
                as: 'Owner',
                attributes: ['username', 'displayname']
            },
            {model: models.Tag, as: 'Tag'}
        ],
        where: {
            // TODO 전개 연산자를 사용하는 이유 : 삼항연산자를 쓰고 싶을 때 저렇게 사용
            /**
             * where 태그명 like or 제품명 like
             *
             * or (Op.or, Op.like -> Sql injection 공격 안당하려고 Op.xxx 이렇게 사용)
             *  - 태그명 like
             *  - 제품명 like
             */
            ...(
                // 검색어가 있는 경우
                ('name' in req.query && req.query.name) ?
                    {
                        // + 태그에서 가져옴 or
                        [models.Sequelize.Op.or]: [
                            // subQuery에 접근하는 방식 : Tag.name
                            models.Sequelize.where(models.Sequelize.col('Tag.name'), {
                                [models.Sequelize.Op.like]: `%${req.query.name}%`
                            }),
                            {
                                'name': {
                                    [models.Sequelize.Op.like]: `%${req.query.name}%`
                                }
                            }
                        ],
                    }
                    :
                    ''),
        }
    });

    // 좋아요 내용을 가져온다
    const userLikes = await require('../../helpers/userLikes')(req);

    // console.log(models.Products.findAll())
    res.render('home.html', {products, userLikes});
};
