const fruit = (sequelize , DataTypes) => {
    const Fruit = sequelize.define('fruit', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    })
    Fruit.associate = models => {
        Fruit.belongsTo(models.User)
    }
    return Fruit
}

module.exports = fruit