import { combineReducers } from "redux";
import alert from "./Alert";
import auth from "./authen";
import goal from "./Goal";
import profile from "./Profile";
export default combineReducers({ alert, auth, goal, profile });
