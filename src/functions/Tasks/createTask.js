import { AuthenticationError } from "apollo-server";
import { Task, TaskTC } from "../../models/Task";

export const createTask = {
  type: TaskTC,
  args: TaskTC.mongooseResolvers.createOne().getArgs(),
  resolve: async (parent, args, context, info) => {
    if (!context.user) {
      throw new AuthenticationError("Must be logged in");
    }

    const newTask = await Task.create({
      ...args.record,
      user_id: context.user._id,
    });

    return newTask;
  },
};
