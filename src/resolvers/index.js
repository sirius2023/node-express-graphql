const { GraphQLDateTime } = require('graphql-iso-date')
const userResolvers = require('./user')
const fruitResolvers = require('./fruit')
const vegetableResolvers = require('./vegetable')

const customScalarResolver = {
    Date: GraphQLDateTime
}
module.exports = [
    customScalarResolver,
    userResolvers,
    fruitResolvers,
    vegetableResolvers

]