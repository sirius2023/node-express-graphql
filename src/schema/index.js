const { gql } = require('apollo-server-express')

var userSchema = require('./user')
var fruitSchema = require('./fruit')
var vegetableSchema = require('./vegetable')
const linkSchema = gql`
    scalar Date

    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }
`

module.exports = [
    linkSchema,
    userSchema,
    fruitSchema,
    vegetableSchema
]