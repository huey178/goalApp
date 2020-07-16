import axios from "axios";
import {
  GET_MY_PROFILE,
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  SEARCH,
  CLEAR_PROFILE,
} from "./Types";

export const getMyProfile = () => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/`);
    dispatch({
      type: GET_MY_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.msg },
    });
  }
};

export const editProfile = (profileEdits) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post("/api/profile/", profileEdits, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.msg },
    });
  }
};

export const searchUsers = (name) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/user/${name}`);
    dispatch({
      type: SEARCH,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.msg },
    });
  }
};

export const getProfile = (_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${_id}`);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.msg },
    });
  }
};

export const clearProfile = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE,
  });
};
