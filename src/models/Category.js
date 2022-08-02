const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { composeMongoose } = require("graphql-compose-mongoose");
const { TaskTC, Task } = require("./Task");

const { Schema } = mongoose;

const ModelSchema = new Schema(
  {
      title: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      category_tasks: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "CategoryTasks"
      }],
      tasks: {type: [Task]}
    },
  {
    collection: "categories",
  }
);

ModelSchema.plugin(timestamps);
ModelSchema.set("toObject", { getters: true });

const Category = mongoose.model("Category", ModelSchema);

const CategoryTC = composeMongoose(Category, {});

CategoryTC.addRelation('category_tasks', {
    resolver: () => CategoryTC.mongooseResolvers.findMany(),
    prepareArgs: {
        filter: (source) => ({
            _operators: {
                _id: {
                    in: source.category_tasks || [],
                },
            },
        }),
    },
    projection: { category_tasks: true },
});

module.exports = { CategoryTC, Category };
