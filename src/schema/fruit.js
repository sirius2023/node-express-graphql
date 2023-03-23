const asexpress = require('apollo-server-express')
const gql = asexpress.gql

const fruit = gql`
    extend type Query {
        fruits: [Fruit!]
        fruit(id: ID!): Fruit!
    }
    extend type Mutation {
        createFruit(name: String!): Fruit!
        deleteFruit(id: ID!): Boolean!
        editFruit(id: ID!, name: String!): Fruit!
    }
    type Fruit{
        id: ID!
        name: String!
        createdAt: Date!
        user: User!
    }
`

module.exports = fruit