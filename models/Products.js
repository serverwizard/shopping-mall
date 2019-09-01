const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    let Products = sequelize.define('Products', {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        name: {type: DataTypes.STRING},
        thumbnail : { type: DataTypes.STRING },
        price: {type: DataTypes.INTEGER},
        description: {type: DataTypes.TEXT}
    }, { // 옵션 설정
        timestamps: true,
        underscored: true
    });

    // Product 모델 관계도
    Products.associate = (models) => {

        // Memo 모델에 외부키를 둠
        // onDelete 옵션이 'CASCADE'인 경우 제품이 삭제되면 자신의 메모들도 전부 삭제됨
        Products.hasMany(models.ProductsMemo, {
            // as에 따라 함수명이 변경됨 (as 중요함)
            as: 'Memo',
            foreignKey: 'product_id',
            sourceKey: 'id',
            onDelete: 'CASCADE'
        });

    };


    Products.prototype.dateFormat = (date) => (
        moment(date).format('YYYY-MM-DD')
    );

    return Products;
};
