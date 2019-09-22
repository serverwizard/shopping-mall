module.exports = function (sequelize, DataTypes) {
    const Cart = sequelize.define('Cart',
        {
            id: {type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
            product_id: {type: DataTypes.STRING},
            number: {type: DataTypes.INTEGER},
            amount: {type: DataTypes.INTEGER},
            thumbnail: {type: DataTypes.STRING},
            name: {type: DataTypes.STRING}
        }, {
            tableName: "Carts"
        }
    );

    return Cart;
};