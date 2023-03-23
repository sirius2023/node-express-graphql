const vegetable = (sequelize , DataTypes) => {
    const Vegetable = sequelize.define('vegetable', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    })
    Vegetable.associate = models => {
        Vegetable.belongsTo(models.User)
    }
    return Vegetable
}

module.exports = vegetable