import {
  GET_MY_PROFILE,
  GET_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  SEARCH,
} from "../actions/Types";

const initialState = {
  profile: {
    user: {},
  },
  profiles: [],
  foundUsers: {
    searched: false,
    users: [],
  },
  errors: {},
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MY_PROFILE:
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case SEARCH:
      return {
        ...state,
        foundUsers: { users: payload, searched: true },
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        errors: payload,
        loading: false,
      };
    case CLEAR_PROFILE:
      return {
        profile: { user: {} },
        profiles: [],
        foundUsers: {
          searched: false,
          users: [],
        },
        errors: {},
        loading: true,
      };
    default:
      return state;
  }
}
