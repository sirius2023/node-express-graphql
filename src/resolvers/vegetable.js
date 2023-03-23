
const {combineResolvers} = require('graphql-resolvers')
const { isAuthenticated, isvegetableOwner, isAuthorization } = require('./middleware')
const Sequelize = require('sequelize')

const vegetable = {
    Query: {
       
        vegetables: async (parent, args,{ models: { Vegetable }}) => {
            return  await Vegetable.findByPk(1)
    
        },
        vegetable: async (parent, {id}, { models: { Vegetable }}) => {
            console.log(id)
            return await Vegetable.findByPk(id)
        }
    },
    Mutation: {
        createVegetable: combineResolvers(
            isAuthenticated,
            async (parent, {name}, {me, models: { Vegetable , User }}) => {

                const vegetable =  await Vegetable.create({
                    name,
                    userId: me.id
                })
                pubsub.publish(EVENTS.MESSAGE.CREATED, {
                    vegetableCreated: { vegetable}
                })
                return vegetable
            }
        ),
        deleteVegetable: combineResolvers(
            isAuthorization("VegetableOwner"),
            async (parent, { id }, { models: { Vegetable} }) => {
                return await Vegetable.destroy({
                    where: {
                        id
                    }
                })
            }
        ),
        editVegetable: combineResolvers(
            isAuthorization("VegetableOwner"),
            async (parent, {id, name},{models: {Vegetable}}) => {
                const vegetable = await Vegetable.findByPk(id)
                if(!vegetable) {
                    throw new UserInputError(
                        'No vegetable found',
                      );
                }
                vegetable.name =name
                await vegetable.save()
                return await vegetable
            }
        )  
    },

}

module.exports = vegetable