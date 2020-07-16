import {
  CREATE_GOAL_LIST,
  CREATE_GOAL,
  CREATE_STEP,
  DELETE_STEP,
  DELETE_GOAL_LIST,
  DELETE_GOAL,
  GOAL_LIST_ERROR,
  GET_MY_GOAL_LISTS,
  GET_GOAL,
  CLEAR_GOAL_LIST,
  GOAL_LIST_COMMENT,
  REMOVE_GOAL_LIST_COMMENT,
  GET_SPECIFIC_GOAL_LIST,
  UPDATE_LIKES_ON_GOAL_LIST,
  MARK_GOAL_LIST_COMPLETE,
  UPDATE_GOAL_STATUS,
  UPDATE_GOAL_LIST_PRIVACY,
  UPDATE_GOAL_PRIVACY,
  UPDATE_LIKES_ON_COMMENT,
  GET_GOAL_LIST_COMPLETED_RATIO,
  GET_GOAL_LIST_GOAL_STATS,
} from "../actions/Types";

const initialState = {
  goalLists: [],
  goalList: [],
  goal: [],
  stats: {},
  goalStats: [],
  loading: true,
  errors: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_GOAL_LIST:
      return { ...state, goalLists: [payload, ...state.goalLists] };
    case GET_SPECIFIC_GOAL_LIST:
      return {
        ...state,
        goalList: payload,
        loading: false,
      };
    case CREATE_GOAL:
      return { ...state, goalList: payload, loading: false };
    case CREATE_STEP:
      return {
        ...state,
        goal: payload,
        loading: false,
      };
    case GET_MY_GOAL_LISTS:
      return {
        ...state,
        goalLists: payload,
        loading: false,
      };
    case GET_GOAL:
      return {
        ...state,
        goal: payload,
        loading: false,
      };
    case DELETE_GOAL_LIST:
      return {
        ...state,
        goalLists: state.goalLists.filter((goal) => payload !== goal._id),
        goalList: [],
        loading: false,
      };
    case DELETE_GOAL:
    case DELETE_STEP:
      return {
        ...state,
        goal: payload,
        loading: false,
      };
    case CLEAR_GOAL_LIST:
      return {
        ...state,
        goalLists: [],
        goalList: [],
        goal: [],
        stats: [],
        goalStats: [],
        loading: false,
      };
    case GOAL_LIST_ERROR:
      return {
        ...state,
        errors: payload,
      };
    case GOAL_LIST_COMMENT:
    case REMOVE_GOAL_LIST_COMMENT:
    case UPDATE_LIKES_ON_GOAL_LIST:
    case MARK_GOAL_LIST_COMPLETE:
    case UPDATE_GOAL_LIST_PRIVACY:
    case UPDATE_LIKES_ON_COMMENT:
    case UPDATE_GOAL_STATUS:
    case UPDATE_GOAL_PRIVACY:
      return {
        ...state,
        goalList: payload,
        loading: false,
      };
    case GET_GOAL_LIST_COMPLETED_RATIO:
      return {
        ...state,
        stats: payload,
        loading: false,
      };
    case GET_GOAL_LIST_GOAL_STATS:
      return {
        ...state,
        goalStats: payload,
        loading: false,
      };
    default:
      return state;
  }
}
