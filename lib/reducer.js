import { actionTypes, defaultRoom, defaultPost } from "./actions";

export const reducerRoom = (state = defaultRoom, action) => {
  switch (action.type) {
    case actionTypes.SET_ROOM:
      return { ...state, ...action.data };
    default:
      return state;
  }
};

export const reducerPosts = (state = defaultPost, action) => {
  switch (action.type) {
    case actionTypes.SET_POST:
      return { ...state, ...action.data };
    default:
      return state;
  }
};
