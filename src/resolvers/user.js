const jwt = require('jsonwebtoken')
const {AuthenticationError, UserInputError, ForbiddenError } = require('apollo-server')
const { isAuthorization } = require('./middleware')
const { combineResolvers } = require('graphql-resolvers')

const createToken = async ( user, secret, expiresIn ) => {
    const { id, email, username, role} = user
    return await jwt.sign({
        id, email, username, role
    }, secret, { expiresIn })
}
const user = {
    Query: {
        me: async  (_, args, {me}) => {
            return await  me
        },
        user: async (parent, {id}, { models: {User}}) => {
            return await User.findByPk(id)
        },
        users: async (parent, args, contextValue) => {
            if(!contextValue.me || contextValue.me.role != "ADMIN") return null
            return await contextValue.models.User.findAll()
        },
    },
    Mutation: {
        signUp: async (parent, { username, email, password }, { models: { User }, secret }) => {
            const user = await User.create({
                username, email, password
            })
            const token = createToken(user, secret, '30d')
            return {
                token
            }
        },
        signIn: async (parent, { login, password}, {models: { User }, secret}) => {
            const user = await User.findByLogin(login)
            if(!user) {
                throw new UserInputError(
                    'No user found with this login credentials.',
                  );
            }
            const isValid = await user.validatePassword(password)
            if (!isValid) {
                throw new AuthenticationError('Invalid password.');
            }
            return {
                token: createToken(user, secret, '30d')
            }
        },
        editUser: async(parent, {id, username, email, password1, password2}, {me, models:{User}}) => {
            if (id == me.id || me.role != "ADMIN") {
                throw new ForbiddenError('You can not edit');
            }
            const user = await User.findByPk(id)
            console.log(email)
            if(!user) {
                throw new UserInputError(
                    'No user found.',
                  );
            }
            const isValid = await user.validatePassword(password1)
            if (!isValid) {
                throw new AuthenticationError('Invalid password.');
            }
            await user.update({username, email, password2})
            await user.save()
            return await user

        },
        deleteUser: combineResolvers(
            isAuthorization("ADMIN"),
            async (parent, { id }, {me, models: { User }}) => {
                if (id == me.id) {
                    console.log("hahahah")
                    throw new ForbiddenError('You can not delete yourself');
                }
                return await User.destroy({
                    where: { id }
                })
            }
        ),
    },

    User: {
        // username: (parent) => parent.firstname + " " + parent.lastname,
        vegetables: async (parent, args, { me, models: { Vegetable, User} }) => {
            return await Vegetable.findAll({
                where: {
                    userId: parent.id
                }
            })
        },
        fruits: async (parent, args, { me, models: { Fruit, User} }) => {
            return await Fruit.findAll({
                where: {
                    userId: parent.id
                }
            })
        }

    },
   
}

module.exports = user