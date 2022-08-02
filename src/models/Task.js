const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { composeMongoose } = require("graphql-compose-mongoose");
const { CategoryTC, Category } = require("./Category");

const { Schema } = mongoose;

const ModelSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    category: {
      title: {
        type: String
      },
      color: {
        type: String
      },
       category_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CategoryId",
      default: null
    },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    visible_from: {
      type: Date,
    },
    start_date: {
      type: Date,
    },
    end_date: {
      type: Date,
    },
    location: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    addressInput: {
      place_id: {
        type: String,
      },
      term: {
        type: String,
      },
      town: {
        type: String,
      },
    },
    duration: {
      value: {
        type: Number,
      },
      unit: {
        type: String,
        enum: ["DAYS", "HOURS"],
      },
    },
    is_remote: {
      type: Boolean,
    },
    images: {
      type: JSON,
      default: [],
    },
    status: {
      type: String,
      enum: ["NEW", "OFFER_ACCEPTED", "COMPLETED"],
    },
    description: {
      type: String,
    },
    number_of_offers: {
      type: Number,
    },
    number_of_likes: {
      type: Number,
    },
  },
  {
    collection: "tasks",
  }
);

ModelSchema.plugin(timestamps);
ModelSchema.set("toObject", { getters: true });

const Task = mongoose.model("Task", ModelSchema);

const TaskTC = composeMongoose(Task, {});

TaskTC.addRelation('category', {
    resolver: () => CategoryTC.mongooseResolvers.findOne(),
    prepareArgs: {
        filter: (source) => ({
            _operators: {
                _id: {
                    in: source.category || [],
                },
            },
        }),
    },
    projection: { category: true },
});

module.exports = { TaskTC, Task };
