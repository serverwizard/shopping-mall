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
        let user = await models.User.findByPk(req.params.id);
        res.render('users/detail.html', {user});
    } catch (err) {
        console.error(err);
    }
};
