const models = require('../../models');

exports.get_users = async (req, res) => {
    try {
        let users = await models.User.findAll();
        res.render('users/list.html', {users});
    } catch (err) {
        console.error(err);
    }
};

exports.get_user = async (req, res) => {
    try {
        const user = await models.User.findOne({
            where: {
                id: req.params.id,
            },
            include: [
                {
                    model: models.Products,
                    as: 'Likes',
                    include: [
                        'LikeUser',
                        {model: models.Tag, as: 'Tag'},
                    ]
                },
            ],
        });

        res.render('users/detail.html', {user});
    } catch (err) {
        console.error(err);
    }
};
