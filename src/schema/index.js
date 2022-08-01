const { schemaComposer } = require("graphql-compose");

require("../models/AdminPermissionRole");

const {
  Query: AdminUserQuery,
  Mutation: AdminUserMutation,
} = require("./AdminUser");

const { Query: UserQuery, Mutation: UserMutation } = require("./User");

const {
  Query: PermissionRoleQuery,
  Mutation: PermissionRoleMutation,
} = require("./PermissionRole");

const {
  Query: PermissionQuery,
  Mutation: PermissionMutation,
} = require("./Permission");

const {
  Query: TaskMessageQuery,
  Mutation: TaskMessageMutation,
} = require("./TaskMessage");

const { Query: TaskQuery, Mutation: TaskMutation } = require("./Task");

const { Query: CategoryQuery, Mutation: CategoryMutation } = require("./Category");

const { Mutation: PageMutation, Query: PageQuery } = require("./Page");

schemaComposer.Query.addFields({
  ...UserQuery,
  ...PermissionRoleQuery,
  ...PermissionQuery,
  ...AdminUserQuery,
  ...TaskQuery,
  ...TaskMessageQuery,
  ...PageQuery,
  ...CategoryQuery,
});

schemaComposer.Mutation.addFields({
  ...UserMutation,
  ...PermissionRoleMutation,
  ...PermissionMutation,
  ...AdminUserMutation,
  ...TaskMutation,
  ...TaskMessageMutation,
  ...PageMutation,
  ...CategoryMutation,
});

module.exports = schemaComposer.buildSchema();
