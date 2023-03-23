const ForbiddenError = require('apollo-server').ForbiddenError
const { skip, combineResolvers } = require('graphql-resolvers')
 
const isAuthenticated = (parent, args, {me}) => {
  return me ? skip : new ForbiddenError('403 Error');
}
  
const isAuthorization = (my_role)  => combineResolvers(
    isAuthenticated,
    (parent, args, { me: { role }}) => (
      (role === my_role || role === "ADMIN" )?
      skip:
      new ForbiddenError('Not authenticated as admin')
    )
  )
module.exports = {isAuthenticated, isAuthorization}