require('dotenv').config()
const Sequelize = require('sequelize')
const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DATABASE_USER,
    process.env.DATABASE_PASSWORD,
    {
        dialect: 'mysql'
    }
)

const models = {
    User: require('./user')(sequelize, Sequelize.DataTypes),
    Vegetable: require('./vegetable')(sequelize, Sequelize.DataTypes),
    Fruit: require('./fruit')(sequelize, Sequelize.DataTypes)
}

Object.keys(models).forEach(key => {
    if ('associate' in models[key]) {
        models[key].associate(models)
    }
})

module.exports = { models, sequelize }

