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

    // 사용자 모델 관계도
    User.associate = (models) => {
        // 상품 모델에 외부키를 건다
        // onDelete 옵션의 경우 사용자 하나가 삭제되면 외부키가 걸린 상품들도 싹다 삭제해준다 단 sync를 다시 해줘야됨
        // as 의 경우 모델명과 똑같이 하지 않는다 Products (x)
        User.hasMany(
            models.Products,
            {
                as: 'Product',
                foreignKey: 'user_id',
                sourceKey: 'id',
                onDelete: 'CASCADE'
            }
        );

        // 사용자와 장바구니와의 관계 설정
        User.hasMany(models.Cart,
            {
                as: 'Cart',
                foreignKey: 'user_id',
                sourceKey: 'id',
                onDelete: 'CASCADE'
            });
    };

    // sequelize hook 사용, accounts 라우터에서 req.body.password로 직접 핸들링해도 됨
    User.beforeCreate((user, _) => {
        user.password = passwordHash(user.password);
    });

    return User;
};
