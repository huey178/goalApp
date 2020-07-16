const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GoalSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "ref",
  },
  title: {
    type: String,
    required: true,
  },
  goals: [
    {
      goal: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      steps: [
        {
          step: {
            type: String,
          },
        },
      ],
      likes: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "user",
          },
        },
      ],
      isPrivate: {
        type: Boolean,
        default: false,
      },
      comments: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "user",
          },
          name: {
            type: String,
          },
          avatar: {
            type: String,
          },
          date: {
            type: Date,
            default: Date.now,
          },
          text: {
            type: String,
            required: true,
          },
          likes: [
            {
              user: {
                type: Schema.Types.ObjectId,
                ref: "user",
              },
            },
          ],
        },
      ],
      complete: {
        type: Boolean,
        default: false,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      text: {
        type: String,
        required: true,
      },
      likes: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "user",
          },
        },
      ],
    },
  ],
  complete: {
    type: Boolean,
    default: false,
  },
});

module.exports = Goal = mongoose.model("goal", GoalSchema);
