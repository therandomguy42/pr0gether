import fetch from "isomorphic-unfetch";
import { SERVER_URL } from "../constants";

export async function fetchFromPro(room) {
  if (!room) {
    return {};
  }

  let url = `${SERVER_URL}/api/pr0`;
  const { promoted, currently_shown, flags, user, likes } = room;

  url += "?promoted=" + (promoted ? 1 : 0);

  if (typeof currently_shown !== "undefined") {
    url += "&currently_shown=" + currently_shown;
  }

  if (flags && typeof flags !== "undefined") {
    url += "&flags=" + flags;
  }

  if (likes && typeof likes !== "undefined") {
    url += "&likes=" + likes;
  } else if (!!user && typeof user !== "undefined") {
    url += "&user=" + user;
  }

  let response = await fetch(url);

  return await response.json();
}
