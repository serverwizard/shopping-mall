const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    let Contacts = sequelize.define('Contacts', {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING},
        certificate: {type: DataTypes.STRING},
        description: {type: DataTypes.TEXT}
    }, { // 옵션 설정
        timestamps: true,
        underscored: true
    });

    // 모델 관계를 설정하는 방법
    Contacts.associate = (models) => {

        // Memo 모델에 외부키를 둠
        // onDelete 옵션이 'CASCADE'인 경우 제품이 삭제되면 자신의 메모들도 전부 삭제됨
        Contacts.hasMany(models.ContactsMemo, {
            // as에 따라 함수명이 변경됨 (as 중요함)
            as: 'Memo',
            foreignKey: 'contact_id',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        });

    };

    Contacts.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD')
    );

    return Contacts;
};
