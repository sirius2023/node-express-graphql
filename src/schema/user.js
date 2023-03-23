const asexpress = require('apollo-server-express')
const gql = asexpress.gql

const user = gql`
    extend type Query {
        users: [User!]
        me: User
        user(id: ID!): User
    }
    extend type Mutation {
        signUp(
            username: String!
            email: String!
            password: String!
        ): Token!
        signIn(login: String!, password: String!): Token!
        deleteUser(id: ID!): Boolean!
        editUser(id:ID!, username:String!, email: String!, password1: String!, password2: String!): User!
    }
    type User {
        id: ID!
        username: String!
        email: String!
        role: String
        fruits: [Fruit!]
        vegetables: [Vegetable!]
    }
    type Token {
        token: String!
    }
`

module.exports = user