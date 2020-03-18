export const PR0_VIDEO_URL = "https://vid.pr0gramm.com/";
export const PR0_IMAGE_URL = "https://img.pr0gramm.com/";
export const PR0_THUMB_URL = "https://thumb.pr0gramm.com/";

export const SERVER_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://127.0.0.1:8080";

const SFW = 1;
const NSFW = 2;
const NSFL = 4;
const NSFP = 8;
export const PostFlags = {
  SFW,
  NSFW,
  NSFL,
  NSFP,
  All: SFW | NSFW | NSFL | NSFP
};
