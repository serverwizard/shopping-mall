module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define('Tag',
        {
            id: {type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true},
            name: {
                type: DataTypes.STRING(200),
                validate: {
                    len: [0, 50]
                },
                allowNull: false
            }
        },
        {
            tableName: 'Tag',
        }
    );

    Tag.associate = (models) => {
        Tag.belongsToMany(models.Products, {
            through: {
                model: 'TagProduct',
                unique: false
            },
            as: 'Product',
            foreignKey: 'tag_id',
            sourceKey: 'id',
            constraints: false
        });
    };

    return Tag;
};