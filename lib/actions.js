export const actionTypes = {
  SET_ROOM: "SET_ROOM",
  SET_POST: "SET_POST"
};

export const defaultRoom = {
  name: "default",
  currentTime: 0,
  currently_shown: 879293,
  isPlaying: false,
  promoted: 0,
  user: "cha0s"
};

export const defaultPost = {
  audio: false,
  image: ""
};

export const setRoom = data => {
  return { type: actionTypes.SET_ROOM, data };
};

export const setPost = data => {
  return { type: actionTypes.SET_POST, data };
};
