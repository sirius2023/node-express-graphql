
const {combineResolvers} = require('graphql-resolvers')
const { isAuthenticated, isAuthorization } = require('./middleware')
const Sequelize = require('sequelize')

const fruit = {
    Query: {
        fruits: async (parent, args, { models: { Fruit }}) => {
            return  await Fruit.findAll()
        },
        fruit: async (parent, {id}, { models: { Fruit }}) => {
            return await Fruit.findByPk(id)
        }
    },
    Mutation: {
        createFruit: combineResolvers(
            isAuthenticated,
            async (parent, {name}, {me, models: { Fruit}}) => {

                const fruit =  await Fruit.create({
                    name,
                    userId: me.id
                })
                return await fruit
            }
        ),
        deleteFruit: combineResolvers(
            isAuthorization("FruitOwner"),
            async (parent, { id }, { models: { Fruit} }) => {
                return await Fruit.destroy({
                    where: {
                        id
                    }
                })
            }
        ),
        editFruit: combineResolvers(
            isAuthorization("FruitOwner"),
            async (parent, {id, name},{models: {Fruit}}) => {
                const fruit = await Fruit.findByPk(id)
                console.log(fruit)
                if(!fruit) {
                    throw new UserInputError(
                        'No fruit found',
                      );
                }
                fruit.name = name
                await fruit.save()
                return await fruit
            }
        ) 
    },
}

module.exports = fruit