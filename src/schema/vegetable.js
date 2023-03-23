const asexpress = require('apollo-server-express')
const gql = asexpress.gql

const vegetable = gql`
    extend type Query {
        vegetables: [Vegetable!]
        vegetable(id: ID!): Vegetable!
    }
    extend type Mutation {
        createVegetable(name: String!): Vegetable!
        deleteVegetable(id: ID!): Boolean!
        editVegetable(id: ID!, name: String!): Vegetable!
    }
    type Vegetable {
        id: ID!
        name: String!
        createdAt: Date!
        user: User!
    }
`

module.exports = vegetable