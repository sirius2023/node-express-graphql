const express = require('express')
const jwt = require('jsonwebtoken')
const DataLoader = require('dataloader')
const cors = require('cors')
const Sequelize = require('sequelize')
const http = require('http')
require('dotenv').config
const asexpress = require('apollo-server-express')
const ApolloServer = asexpress.ApolloServer
const AuthenticationError = asexpress.AuthenticationError
const  { models, sequelize } = require('./models')
const resolvers = require('./resolvers')
const schema = require('./schema')
const app = express()
app.use(cors())




// Get Authenticated User
const getMe = async req => {
    const token = req.headers['authorization'].slice(7)

    if(token) {
        try {
            return await jwt.verify(token, process.env.SECRET)
        } catch(e) {
            throw new AuthenticationError(
                'Your session expired. Sign in again.',
              );
        }
    }
}

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({req, connection}) => {
      if (connection) {
        return {models}
      }
      if (req) {
        return {
          models,
          me: await getMe(req),
          secret: process.env.SECRET,
        }
      }
    }
})

server.applyMiddleware({app, path: '/graphql'})
// Create http server and install subscription server
const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)

const eraseDatabaseOnSync = true

sequelize.sync({ force: eraseDatabaseOnSync}).then(async () => {
    if (eraseDatabaseOnSync) {
        createUser(new Date())
    }
    httpServer.listen({port : 8000}, () => {
        console.log('Apollo Server on http://localhost:8000/graphql')
    })
})

const createUser = async ( date ) => {
    await models.User.create(
        {
          username: 'rwieruch',
          email: 'hello@robin.com',
          password: 'rwieruch',
          role: 'ADMIN',
          fruits: [
            {
              name: 'apple'
            },
          ],
          vegetables: [
            {
              name: 'tomato'
            },
          ],
        },
        {
          include: [models.Fruit, models.Vegetable],
        },
      );
     
      await models.User.create(
        {
          username: 'ddavids',
          email: 'hello@david.com',
          password: 'ddavids',
          fruits: [
            {
              name: 'banana'
            },
            {
              name: 'orange'
            },
          ],
          vegetables: [
            {
              name: 'radish'
            },
            {
              name: 'eggplant'
            },
          ],
        },
        {
          include: [models.Fruit, models.Vegetable],
        },
      );
}