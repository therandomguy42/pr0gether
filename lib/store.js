import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { reducerRoom, reducerPosts } from "./reducer";

export function initializeStore(initialState = {}) {
  return createStore(
    combineReducers({ current_room: reducerRoom, current_post: reducerPosts }),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
}
