// 이메일 인증키를 저장할 모델
module.exports = function (sequelize, DataTypes) {
    const EmailKey = sequelize.define('EmailKey',
        {
            id: {type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
            hash_key: {
                type: DataTypes.STRING(200),
                unique: true,
                allowNull: false
            }
        }, {
            tableName: 'EmailKey'
        }
    );


    return EmailKey;
};