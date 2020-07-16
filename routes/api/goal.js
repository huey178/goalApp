const express = require("express");
const { check, validationResult } = require("express-validator");
const Goal = require("../../models/Goal");
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const router = express.Router();

//Add routes to make a goal private and to mark them as complete

//public route
//get all non private goal lists
// /api/goal/
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ date: -1 });
    const publicGoals = goals.filter((goal) => goal.private == false);
    return res.json(publicGoals);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
});
//Private Route
//get specific goal list
//  /api/goal/:id
router.get("/:id", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ msg: "Goal list was not found" });
    }
    return res.status(200).json(goal);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server Error");
  }
});

// Public Route
// get a user's goal lists
// /api/goal/user/:user_id

router.get("/user/:user_id", async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.params.user_id }).sort({
      date: -1,
    });
    res.json(goals);
  } catch (error) {
    return res.json({ msg: error });
  }
});

// Public
// get a user's goal
// /api/goal/:goalList_id/:goal_id

router.get("/:goalList_id/:goal_id", async (req, res) => {
  try {
    const goalList = await Goal.findById(req.params.goalList_id);
    if (!goalList) {
      return res.status(404).json({ msg: "Goal list was not found" });
    }

    const goal = goalList.goals.filter(
      (goal) => goal._id.toString() === req.params.goal_id
    );

    if (!goal) {
      return res.status(404).json({ msg: "Goal was not found" });
    }
    return res.json(goal);
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
});

//Private Route
//Post a goal list
// /api/goal

router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const { id, avatar } = user;
    const { title, private } = req.body;

    let goalList = new Goal({
      user: id,
      title: title,
      private: private,
      avatar: avatar,
    });

    await goalList.save();
    return res.json(goalList);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

// Private Route
// Put a specific goal on a goal list
//  /api/goal/:goal_id

router.put(
  "/:goal_id",
  [auth, [check("goal", "Goal is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const goalList = await Goal.findById(req.params.goal_id);

      if (req.user.id === goalList.user.toString()) {
        const newGoal = {
          goal: req.body.goal,
        };

        goalList.goals.push(newGoal);
        await goalList.save();
        return res.json(goalList);
      }
      return res.json("You are not authorized to modify this list");
    } catch (error) {
      return res.status(500).send("Server Error");
    }
  }
);

//Private
// Post a step to goal
// /api/goal/:goalList_id/:goal_id

router.post(
  "/:goalList_id/:goal_id",
  [auth, [check("steps", "Step is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (req.user.id === goalList.user.toString()) {
        const goal = goalList.goals.find(
          (goal) => goal._id.toString() === req.params.goal_id
        );

        const step = {
          step: req.body.steps,
        };

        goal.steps.push(step);
        await goalList.save();

        return res.status(200).json(goal);
      }
      return res.status(400).json("You are not authorized to add steps");
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

// Private
// Put a comment on a goal list
// api/goal/comment/:goalList

router.put(
  "/comments/:goal_id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
    }
    try {
      const goalList = await Goal.findById(req.params.goal_id);
      const user = await User.findById(req.user.id).select("-password");
      if (!goalList) {
        return res.status(400).json("Goal list was not found");
      }
      if (!user) {
        return res.status(400).json("User was not found");
      }
      const comment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      goalList.comments.push(comment);
      await goalList.save();
      return res.json(goalList);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

//Private
// Put comment on a goal in a goal list
// /api/goal/goalList/:goalList_id/goal/:goal_id
router.put(
  "/goalList/:goalList_id/goal/:goal_id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(400).json("Goal list was not found");
      }
      const goal = goalList.goals.find(
        (goal) => goal.id.toString() === req.params.goal_id
      );

      if (!goal) {
        return res.status(400).json("Goal was not found");
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(400).json("User was not found");
      }

      const comment = {
        text: req.body.text,
        user: user.id,
        avatar: user.avatar,
        name: user.name,
      };

      goal.comments.unshift(comment);
      await goalList.save();
      return res.json(goal);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

//Private
// Put a like on a Goal List
// /api/goal/goalList/:goalList_id/like

router.put("/goalList/:goalList_id/like", auth, async (req, res) => {
  try {
    const goalList = await Goal.findById(req.params.goalList_id);
    if (!goalList) {
      return res.status(400).json("Goal list was not found");
    }
    const foundLikes = goalList.likes.filter(
      (like) => like.user.toString() === req.user.id
    );
    if (foundLikes.length > 0) {
      return res.status(400).json("Comment has already been liked");
    }
    goalList.likes.unshift({ user: req.user.id });

    await goalList.save();
    return res.json(goalList);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

//Private
// Put a like on a goal
// /api/goal/goalList/:goalList_id/goal/:goal_id/like

router.put(
  "/goalList/:goalList_id/goal/:goal_id/like",
  auth,
  async (req, res) => {
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(400).json("Goal list was not found");
      }
      const goal = goalList.goals.find(
        (goal) => goal.id.toString() === req.params.goal_id
      );
      if (!goal) {
        return res.status(400).json("Goal was not found");
      }
      const foundLikes = goal.likes.filter(
        (like) => like.user.toString() === req.user.id
      );
      if (foundLikes.length > 0) {
        return res.status(400).json("Post has already been liked");
      }
      goal.likes.unshift({ user: req.user.id });
      await goalList.save();
      return res.json(goal);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

// Private
// Put a Like on a goal list Comment
// /api/goal/goalList/:goalList_id/comment/:comment_id/like

router.put(
  "/goalList/:goalList_id/comment/:comment_id/like",
  auth,
  async (req, res) => {
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(400).json("Goal list was not found");
      }
      const comment = goalList.comments.find(
        (comment) => comment.id === req.params.comment_id
      );

      if (!comment) {
        return res.status(400).json("Comment was not found");
      }
      const foundLikes = comment.likes.filter(
        (like) => like.user.toString() === req.user.id
      );

      if (foundLikes.length > 0) {
        return res.status(400).json("Comment has already been liked");
      }

      comment.likes.unshift({ user: req.user.id });
      await goalList.save();
      return res.status(200).json(goalList);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

//Private
//Put a like on goal Comment
// /api/goal/goalList/:goalList_id/goal/:goal_id/comment/:comment_id/like

router.put(
  "/goalList/:goalList_id/goal/:goal_id/comment/:comment_id/like",
  auth,
  async (req, res) => {
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(400).json("Goal list was not found");
      }
      const goal = goalList.goals.find(
        (goal) => goal.id.toString() === req.params.goal_id
      );
      if (!goal) {
        return res.status(400).json("Goal was not found");
      }
      const comment = goal.comments.find(
        (comment) => comment.id.toString() === req.params.comment_id
      );
      if (!comment) {
        return res.status(400).json("Comment was not found");
      }
      const foundLikes = comment.likes.filter(
        (like) => like.user.toString() === req.user.id
      );
      if (foundLikes.length > 0) {
        return res.status(400).json("You have already liked this comment");
      }
      comment.likes.unshift({ user: req.user.id });
      await goalList.save();
      return res.json(goal);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

// Private
// Delete a Goal List
// /api/goal/:/goal_id

router.delete("/:goal_id", auth, async (req, res) => {
  try {
    const goalList = await Goal.findById(req.params.goal_id);
    if (!goalList) {
      return res.status(400).json("Goal was not found");
    }
    if (goalList.user.toString() === req.user.id) {
      await goalList.remove();
      return res.status(200).json("Goal list has been removed");
    }
    return res.status(400).json("You are not authorized to delete this goal.");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

// Private
// Delete a goal from a goal list
// /api/goal/:goalList_id/:goal_id

router.delete("/:goalList_id/:goal_id", auth, async (req, res) => {
  try {
    const goalList = await Goal.findById(req.params.goalList_id);
    if (!goalList) {
      return res.status(400).json("Goal list was not found");
    }
    const goals = goalList.goals.filter(
      (goal) => goal._id.toString() === req.params.goal_id
    );
    if (!goals) {
      return res.status(400).json("Goal was not found");
    }
    if (goalList.user.toString() === req.user.id) {
      const removeIndex = goalList.goals.indexOf(goals[0]);
      goalList.goals.splice(removeIndex, 1);

      await goalList.save();

      return res.json(goalList);
    }
    return res.status(400).json("You are not authorized to do this");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

// Private
// Delete a step
// api/goal/:goalList_id/:goal_id/:step_id

router.delete("/:goalList_id/:goal_id/:step_id", auth, async (req, res) => {
  try {
    const goalList = await Goal.findById(req.params.goalList_id);
    if (!goalList) {
      return res.status(400).json("Goal list was not found");
    }
    if (goalList.user.toString() === req.user.id) {
      const goal = goalList.goals.find(
        (goal) => goal._id.toString() === req.params.goal_id
      );
      if (!goal) {
        return res.status(400).json("Goal was not found");
      }
      const foundStep = goal.steps.filter(
        (step) => step._id.toString() === req.params.step_id
      );

      if (foundStep < 0) {
        return res.status(404).json("Index not found");
      }
      const stepIndex = goal.steps.indexOf(foundStep[0]);

      goal.steps.splice(stepIndex, 1);

      await goalList.save();
      return res.json(goal);
    }
    return res.status(400).json("You are not authorized to delete steps");
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
});

// private
// Delete a comment from a goal list
// /api/goal/comment/:comment_id

router.delete(
  "/goallist/:goalList_id/comment/:comment_id",
  auth,
  async (req, res) => {
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(400).json("Goal list was not found");
      }
      const comment = goalList.comments.find(
        (comment) => comment.id === req.params.comment_id
      );

      if (!comment) {
        return res.status(400).json("Comment was not found");
      }
      if (comment.user.toString() === req.user.id) {
        const commentIndex = goalList.comments.indexOf(comment);
        if (commentIndex < 0) {
          return res.status(400).json("Index was not found");
        }

        goalList.comments.splice(commentIndex, 1);
        await goalList.save();
        return res.json(goalList);
      }
      return res
        .status(400)
        .json("You are not authorized to delete this comment");
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

//Private
// Delete a comment from a goal
// /api/goal/goalList/:goalList_id/goal/:goal_id/comment/:comment_id

router.delete(
  "/goalList/:goalList_id/goal/:goal_id/comment/:comment_id",
  auth,
  async (req, res) => {
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(400).json("Goal list was not found");
      }

      const goal = goalList.goals.find(
        (goal) => goal.id.toString() === req.params.goal_id
      );
      if (!goal) {
        res.status(400).json("Goal was not found");
      }
      const comment = goal.comments.find(
        (comment) => comment.id.toString() === req.params.comment_id
      );
      if (!comment) {
        return res.status(400).json("Comment was not found");
      }

      if (comment.user.toString() === req.user.id) {
        const removeIndex = goal.comments.indexOf(comment);

        goal.comments.splice(removeIndex, 1);
        await goalList.save();
        return res.json(goal);
      }
      return res.status(400).json("You are not authorized to delete this post");
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);
// Private
// Delete like from goal List
// /api/goal/:goalList_id/find/goal/list/unlike

router.delete("/:goalList_id/find/goal/list/unlike", auth, async (req, res) => {
  try {
    const goalList = await Goal.findById(req.params.goalList_id);
    if (!goalList) {
      return res.status(400).json("Goal list was not found");
    }
    const foundLikes = goalList.likes.filter(
      (like) => like.user.toString() === req.user.id
    );
    const like = goalList.likes.find(
      (like) => like.user.toString() === req.user.id
    );

    if (foundLikes.length > 0 && like) {
      const likeIndex = goalList.likes.indexOf(like);
      goalList.likes.splice(likeIndex, 1);

      await goalList.save();
      return res.json(goalList);
    }
    return res.status(400).json("You have not liked this post");
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
});

// Private
// Delete like from goal
// /api/goal/goalList/:goalList_id/goal/:goal_id/find/then/unlike

router.delete(
  "/goalList/:goalList_id/goal/:goal_id/find/then/unlike",
  auth,
  async (req, res) => {
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(400).json("Goal list was not found");
      }
      const goal = goalList.goals.find(
        (goal) => goal.id.toString() === req.params.goal_id
      );
      if (!goal) {
        return res.status(400).json("Goal was not found");
      }
      const foundLikes = goal.likes.filter(
        (like) => like.user.toString() === req.user.id
      );
      const like = goal.likes.find(
        (like) => like.user.toString() === req.user.id
      );

      if (foundLikes.length > 0 && like) {
        const likeIndex = goal.likes.indexOf(like);
        goal.likes.splice(likeIndex, 1);
        await goalList.save();
        return res.json(goal);
      }
      return res.status(400).json("There is no like");
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

//Private
// Delete a like from a comment on a Goal List
// /api/goal/goalList/:goalList_id/comment/:comment_id/unlike

router.delete(
  "/goalList/:goalList_id/comment/:comment_id/unlike",
  auth,
  async (req, res) => {
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(400).json("Goal list was not found");
      }
      const comment = goalList.comments.find(
        (comment) => comment.id.toString() === req.params.comment_id
      );
      if (!comment) {
        return res.status(400).json("comment was not found");
      }
      const foundLikes = comment.likes.filter(
        (like) => like.user.toString() === req.user.id
      );
      const like = comment.likes.find(
        (like) => like.user.toString() === req.user.id
      );

      if (foundLikes.length > 0 && like) {
        const likeIndex = comment.likes.indexOf(like);

        comment.likes.splice(likeIndex, 1);
        await goalList.save();
        return res.json(goalList);
      }
      return res.status(400).json("Like was not found");
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

//Private
//Delete a like from a comment on a Goal
// /api/goal/goalList/:goalList_id/goal/:goal_id/comment/:comment_id/unlike

router.delete(
  "/goalList/:goalList_id/goal/:goal_id/comment/:comment_id/unlike",
  auth,
  async (req, res) => {
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(400).json("Goal list was not found");
      }
      const goal = goalList.goals.find(
        (goal) => goal.id.toString() === req.params.goal_id
      );
      if (!goal) {
        return res.status(400).json("Goal was not found");
      }
      const comment = goal.comments.find(
        (comment) => comment.id.toString() === req.params.comment_id
      );
      if (!comment) {
        return res.status(400).json("Comment was not found");
      }

      const foundLikes = comment.likes.filter(
        (like) => like.user.toString() === req.user.id
      );
      const like = comment.likes.find(
        (like) => like.user.toString() === req.user.id
      );

      if (foundLikes.length > 0 && like) {
        const likeIndex = comment.likes.indexOf(like);

        comment.likes.splice(likeIndex, 1);
        await goalList.save();
        return res.json(goal);
      }
      res.status(400).json("Like was not found");
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

//Private
// Post true in goal list completion
// /api/goal/goalList/:goalList/complete
router.post("/goalList/:goalList_id/complete", auth, async (req, res) => {
  try {
    const goalList = await Goal.findById(req.params.goalList_id);
    if (!goalList) {
      return res.status(400).json("Goal list was not found");
    }
    if (goalList.user.toString() !== req.user.id) {
      return res.status(400).json("You are not authorized to do this");
    }
    goalList.complete = true;
    await goalList.save();
    return res.json(goalList);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

//Private
// Post false in goal list completion
// /api/goal/goalList/:goalList_id/notComplete

router.post("/goalList/:goalList_id/notComplete", auth, async (req, res) => {
  try {
    const goalList = await Goal.findById(req.params.goalList_id);
    if (!goalList) {
      return res.status(400).json("Goal list was not found");
    }
    if (goalList.user.toString() !== req.user.id) {
      return res.status(400).json("You are not authorized to do this");
    }
    goalList.complete = false;
    await goalList.save();
    return res.json(goalList);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

//Private
// Post true to goal completion
// /api/goal/goalList/:goalList_id/goal/:goal/complete

router.post(
  "/goalList/:goalList_id/goal/:goal_id/complete",
  auth,
  async (req, res) => {
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(400).json({ msg: "Goal list was not found" });
      }

      if (goalList.user.toString() !== req.user.id) {
        return res
          .status(400)
          .json({ msg: "You are not authorized to do this" });
      }
      const goal = goalList.goals.find(
        (goal) => goal._id.toString() === req.params.goal_id
      );
      if (!goal) {
        return res.status(400).json({ msg: "Goal was not found" });
      }
      goal.complete = true;
      await goalList.save();
      return res.json(goalList);
    } catch (error) {
      return res.status(500).json("Server Error");
    }
  }
);

//Private
// Post false to goal completion
// /api/goal/goalList/:goalList_id/goal/:goal_id/notComplete

router.post(
  "/goalList/:goalList_id/goal/:goal_id/notComplete",
  auth,
  async (req, res) => {
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(404).json({ msg: "Goal list was not found" });
      }

      const goal = goalList.goals.find(
        (goal) => goal.id.toString() === req.params.goal_id
      );
      if (!goal) {
        return res.status(404).json({ msg: "Goal was not found" });
      }

      goal.complete = false;
      await goalList.save();
      return res.json(goalList);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

//Private
// Post true for private goal list
// /api/goal/goalList/:goalList/private
router.post("/goalList/:goalList_id/private", auth, async (req, res) => {
  try {
    const goalList = await Goal.findById(req.params.goalList_id);
    if (!goalList) {
      return res.status(400).json("Goal list was not found");
    }
    if (goalList.user.toString() !== req.user.id) {
      return res.status(400).json("You are not authorized to do this");
    }
    goalList.isPrivate = true;
    await goalList.save();
    return res.json(goalList);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

//Private
// Post false for private goal list
// /api/goal/goalList/:goalList_id/public
router.post("/goalList/:goalList_id/public", auth, async (req, res) => {
  try {
    const goalList = await Goal.findById(req.params.goalList_id);
    if (!goalList) {
      return res.status(400).json("Goal list was not found");
    }
    if (goalList.user.toString() !== req.user.id) {
      return res.status(400).json("You are not authorized to do this");
    }
    goalList.isPrivate = false;
    await goalList.save();
    return res.json(goalList);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

//Private
// Post true for Goal's privacy
// /api/goal/goalList/:goalList_id/goal/:goal_id/private

router.post(
  "/goalList/:goalList_id/goal/:goal_id/private",
  auth,
  async (req, res) => {
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(400).json("Goal list was not found");
      }
      if (goalList.user.toString() !== req.user.id) {
        return res.status(400).json("You are not authorized to do this");
      }
      const goal = goalList.goals.find(
        (goal) => goal._id.toString() === req.params.goal_id
      );
      if (!goal) {
        return res.status(400).json("Goal was not found");
      }
      goal.isPrivate = true;
      await goalList.save();
      return res.json(goalList);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

//Private
// Post false for Goal's privacy
// /api/goal/goalList/:goalList_id/goal/:goal_id/public

router.post(
  "/goalList/:goalList_id/goal/:goal_id/public",
  auth,
  async (req, res) => {
    try {
      const goalList = await Goal.findById(req.params.goalList_id);
      if (!goalList) {
        return res.status(400).json("Goal list was not found");
      }
      if (goalList.user.toString() !== req.user.id) {
        return res.status(400).json("You are not authorized to do this");
      }
      const goal = goalList.goals.find(
        (goal) => goal._id.toString() === req.params.goal_id
      );
      if (!goal) {
        return res.status(400).json("Goal was not found");
      }
      goal.isPrivate = false;

      await goalList.save();
      return res.json(goalList);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Server Error");
    }
  }
);

router.get("/get/:user_id/goalListStats", auth, async (req, res) => {
  try {
    const stat = {
      numberOfGoalLists: "",
      numberOfCompletedGoals: "",
      GoalListPercentage: "",
    };

    const goalLists = await Goal.find({ user: req.params.user_id });
    if (!goalLists) {
      return res.status(404).json({ msg: "No goals were found" });
    }

    const goalListsArray = [];
    for (var i = 0; i < goalLists.length; i++) {
      goalListsArray.push(goalLists[i]);
    }

    const goalListLength = goalListsArray.length;
    const completeGoalLists = goalLists.filter(
      (goalList) => goalList.complete === true
    ).length;
    const number = (completeGoalLists / goalListLength) * 100;
    stat.numberOfGoalLists = goalListLength;
    stat.numberOfCompletedGoals = completeGoalLists;
    stat.GoalListPercentage = number;
    return res.json(stat);
  } catch (error) {
    return res.status(500).json("Server Error");
  }
});

router.get("/get/all/:user_id/goalListStats", auth, async (req, res) => {
  var GoalStats = {
    goalListName: "",
    goalName: "",
    completedGoalNumber: "",
    totalGoalNumber: "",
    ratio: "",
  };
  var finalStatsArray = [];
  try {
    const goalLists = await Goal.find({ user: req.params.user_id });
    if (!goalLists) {
      return res.status(404).json({ msg: "Goal List was not found" });
    }
    const goalListArray = [];
    for (var i = 0; i < goalLists.length; i++) {
      goalListArray.unshift(goalLists[i]);
    }
    for (var i = 0; i < goalListArray.length; i++) {
      goalListArray[i].isPrivate === true
        ? (GoalStats.goalListName = "Private Goal")
        : (GoalStats.goalListName = goalListArray[i].title);
      GoalStats.completedGoalNumber = goalListArray[i].goals.filter(
        (goal) => goal.complete === true
      ).length;
      GoalStats.totalGoalNumber = goalListArray[i].goals.length;
      GoalStats.ratio =
        (GoalStats.completedGoalNumber / GoalStats.totalGoalNumber) * 100;
      finalStatsArray.unshift(GoalStats);
      GoalStats = {
        goalListName: "",
        goalName: "",
        completedGoalNumber: "",
        totalGoalNumber: "",
        ratio: "",
      };
    }
    return res.json(finalStatsArray);
  } catch (error) {
    return res.status(500).json("Server Error");
  }
});

module.exports = router;
