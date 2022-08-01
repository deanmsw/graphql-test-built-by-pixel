import { AuthenticationError } from "apollo-server";
import {Category, CategoryTC } from "../../models/Category";

export const createCategory = {
  type: CategoryTC,
  args: CategoryTC.mongooseResolvers.createOne().getArgs(),
  resolve: async (parent, args, context, info) => {
    if (!context.user) {
      throw new AuthenticationError("Must be logged in");
    }

    const newCategory = await Category.create({
      ...args.record,
      user_id: context.user._id,
    });

    return newCategory;
  },
};
