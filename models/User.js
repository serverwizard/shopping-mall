const passwordHash = require('../helpers/passwordHash');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
            id: {type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
            username: {
                type: DataTypes.STRING,
                validate: {
                    len: [0, 50]
                },
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                validate: {
                    len: [3, 100]
                },
                allowNull: false
            },
            // 닉네임
            displayname: {type: DataTypes.STRING}
        }, {
            tableName: 'User'
        }
    );

    // sequelize hook 사용, accounts 라우터에서 req.body.password로 직접 핸들링해도 됨
    User.beforeCreate((user, _) => {
        user.password = passwordHash(user.password);
    });

    return User;
};
