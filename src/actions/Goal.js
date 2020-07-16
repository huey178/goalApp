import {
  CREATE_GOAL_LIST,
  GOAL_LIST_ERROR,
  DELETE_GOAL_LIST,
  DELETE_GOAL,
  GET_MY_GOAL_LISTS,
  CLEAR_GOAL_LIST,
  GOAL_LIST_COMMENT,
  REMOVE_GOAL_LIST_COMMENT,
  CREATE_GOAL,
  GET_SPECIFIC_GOAL_LIST,
  GET_GOAL,
  CREATE_STEP,
  DELETE_STEP,
  UPDATE_LIKES_ON_GOAL_LIST,
  MARK_GOAL_LIST_COMPLETE,
  UPDATE_GOAL_STATUS,
  UPDATE_GOAL_LIST_PRIVACY,
  UPDATE_GOAL_PRIVACY,
  UPDATE_LIKES_ON_COMMENT,
  GET_GOAL_LIST_COMPLETED_RATIO,
  GET_GOAL_LIST_GOAL_STATS,
} from "./Types";
import axios from "axios";
import { setAlert } from "./Alert";

export const createGoalList = (title) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ title });
  try {
    const res = await axios.post("/api/goal", body, config);
    dispatch({
      type: CREATE_GOAL_LIST,
      payload: res.data,
    });
    dispatch(setAlert("Goal List has been created", "success"));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error.response.data },
    });
  }
};

export const deleteGoalList = (goalList_Id) => async (dispatch) => {
  try {
    await axios.delete(`/api/goal/${goalList_Id}`);
    dispatch({
      type: DELETE_GOAL_LIST,
      payload: goalList_Id,
    });
    dispatch(setAlert("Goal list has been deleted", "success"));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error.data },
    });
  }
};

export const getMyGoalLists = (userObject) => async (dispatch) => {
  try {
    const id = userObject._id;
    const res = await axios.get(`/api/goal/user/${id}`);
    dispatch({
      type: GET_MY_GOAL_LISTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: error,
    });
  }
};

export const getMyGoalListsSpecial = (user) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/goal/user/${user}`);

    dispatch({
      type: GET_MY_GOAL_LISTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const getSpecificGoalList = (goalList_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/goal/${goalList_id}`);
    dispatch({
      type: GET_SPECIFIC_GOAL_LIST,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const addGoalListComment = (id, text, user) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ text });
  try {
    const res = await axios.put(`/api/goal/comments/${id}`, body, config);

    dispatch({
      type: GOAL_LIST_COMMENT,
      payload: res.data,
    });

    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const removeGoalListComment = (goalList_id, comment_id, user) => async (
  dispatch
) => {
  try {
    const res = await axios.delete(
      `/api/goal/goallist/${goalList_id}/comment/${comment_id}`
    );
    dispatch({
      type: REMOVE_GOAL_LIST_COMMENT,
      payload: res.data,
    });
    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};
export const addLikeToComment = (goalList_Id, comment_id, user) => async (
  dispatch
) => {
  try {
    const res = await axios.put(
      `/api/goal/goalList/${goalList_Id}/comment/${comment_id}/like`
    );
    dispatch({
      type: UPDATE_LIKES_ON_COMMENT,
      payload: res.data,
    });
    dispatch(getSpecificGoalList(goalList_Id));
    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};
export const deleteLikeOnComment = (goalList_Id, comment_id, user) => async (
  dispatch
) => {
  try {
    const res = await axios.delete(
      `/api/goal/goalList/${goalList_Id}/comment/${comment_id}/unlike`
    );
    dispatch({
      type: UPDATE_LIKES_ON_COMMENT,
      payload: res.data,
    });
    dispatch(getSpecificGoalList(goalList_Id));
    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};
export const clearGoals = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_GOAL_LIST,
    });
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
    });
  }
};

export const addGoal = (goal, goalList_id, user) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ goal });

  try {
    const res = await axios.put(`/api/goal/${goalList_id}`, body, config);
    dispatch({
      type: CREATE_GOAL,
      payload: res.data,
    });
    dispatch(getMyGoalListsSpecial(user._id));
    dispatch(getSpecificGoalList(goalList_id));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const deleteGoal = (goalList_id, goal, user) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/goal/${goalList_id}/${goal}`);

    dispatch({
      type: DELETE_GOAL,
      payload: res.data,
    });
    dispatch(getMyGoalListsSpecial(user._id));
    dispatch(getSpecificGoalList(goalList_id));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const getGoal = (goalList_id, goal_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/goal/${goalList_id}/${goal_id}`);
    dispatch({
      type: GET_GOAL,
      payload: res.data,
    });
    dispatch(getSpecificGoalList(goalList_id));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const addStep = (goalList_id, goal_id, steps) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ steps });

  try {
    const res = await axios.post(
      `/api/goal/${goalList_id}/${goal_id}`,
      body,
      config
    );
    dispatch({
      type: CREATE_STEP,
      payload: res.data,
    });
    dispatch(getGoal(goalList_id, goal_id));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const deleteStep = (goalList_id, goal_id, step_id) => async (
  dispatch
) => {
  try {
    const res = await axios.delete(
      `/api/goal/${goalList_id}/${goal_id}/${step_id}`
    );
    dispatch({
      type: DELETE_STEP,
      payload: res.data,
    });
    dispatch(getGoal(goalList_id, goal_id));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const likeGoalList = (goalList_id, user) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/goal/goalList/${goalList_id}/like`);

    dispatch({
      type: UPDATE_LIKES_ON_GOAL_LIST,
      payload: res.data,
    });

    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const unlikeGoalList = (goalList_id, user) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `/api/goal/${goalList_id}/find/goal/list/unlike`
    );

    dispatch({
      type: UPDATE_LIKES_ON_GOAL_LIST,
      payload: res.data,
    });

    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const goalListComplete = (goalList_id, user) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/goal/goalList/${goalList_id}/complete`);
    dispatch({
      type: MARK_GOAL_LIST_COMPLETE,
      payload: res.data,
    });
    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const goalComplete = (goalList_id, goal_id, user) => async (
  dispatch
) => {
  try {
    const res = await axios.post(
      `/api/goal/goalList/${goalList_id}/goal/${goal_id}/complete`
    );
    dispatch({
      type: UPDATE_GOAL_STATUS,
      payload: res.data,
    });
    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const goalIncomplete = (goalList_id, goal_id, user) => async (
  dispatch
) => {
  try {
    const res = await axios.post(
      `/api/goal/goalList/${goalList_id}/goal/${goal_id}/notComplete`
    );
    dispatch({
      type: UPDATE_GOAL_STATUS,
      payload: res.data,
    });
    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const goalListIncomplete = (goalList_id, user) => async (dispatch) => {
  try {
    const res = await axios.post(
      `/api/goal/goalList/${goalList_id}/notComplete`
    );

    dispatch({
      type: MARK_GOAL_LIST_COMPLETE,
      payload: res.data,
    });
    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

// Goal list privacy

export const makePrivate = (goalList_id, user) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/goal/goalList/${goalList_id}/private`);
    dispatch({
      type: UPDATE_GOAL_LIST_PRIVACY,
      payload: res.data,
    });
    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const makePublic = (goalList_id, user) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/goal/goalList/${goalList_id}/public`);
    dispatch({
      type: UPDATE_GOAL_LIST_PRIVACY,
      payload: res.data,
    });
    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const makeGoalPrivate = (goalList_id, goal_id, user) => async (
  dispatch
) => {
  try {
    const res = await axios.post(
      `/api/goal/goalList/${goalList_id}/goal/${goal_id}/private`
    );
    dispatch({
      type: UPDATE_GOAL_PRIVACY,
      payload: res.data,
    });
    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};
export const makeGoalPublic = (goalList_id, goal_id, user) => async (
  dispatch
) => {
  try {
    const res = await axios.post(
      `/api/goal/goalList/${goalList_id}/goal/${goal_id}/public`
    );
    dispatch({
      type: UPDATE_GOAL_PRIVACY,
      payload: res.data,
    });
    dispatch(getMyGoalListsSpecial(user));
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const getGoalListStats = (user_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/goal/get/${user_id}/goalListStats`);
    dispatch({
      type: GET_GOAL_LIST_COMPLETED_RATIO,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};

export const getGoalStats = (user_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/goal/get/all/${user_id}/goalListStats`);
    dispatch({
      type: GET_GOAL_LIST_GOAL_STATS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GOAL_LIST_ERROR,
      payload: { msg: error },
    });
  }
};
