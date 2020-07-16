import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  USER_LOADED,
  AUTH_ERROR,
} from "../actions/Types";

export default function (
  state = {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: true,
    user: "",
    name: "",
  },
  action
) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: null,
      };

    case USER_LOADED:
      return {
        ...state,
        token: localStorage.getItem("token"),
        isAuthenticated: true,
        loading: false,
        user: payload,
        name: payload.name,
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: localStorage.getItem("token"),
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
}
