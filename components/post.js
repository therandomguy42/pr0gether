import React, { Component, Fragment } from "react";
import { PR0_VIDEO_URL, PR0_IMAGE_URL, SERVER_URL } from "../constants";
import { Player, controls, withMediaProps } from "react-media-player";
const {
  PlayPause,
  CurrentTime,
  Volume,
  Duration,
  MuteUnmute,
  Fullscreen
} = controls;

const MAX_TIME_DIFFERENCE = 2;

class Post extends Component {
  isVideo = () => {
    return (
      this.props.post.audio || this.props.post.image.indexOf(".mp4") !== -1
    );
  };

  gunCurrentTime = 0;

  isTimeDifferenceToBig(current, next) {
    return Math.abs(current - next) >= MAX_TIME_DIFFERENCE;
  }

  componentDidMount() {
    gun
      .get(this.props.roomName)
      .get("isPlaying")
      .on(playing => {
        console.log("isPlaying: ", playing);
        if (this.isVideo()) {
          console.log("received isPlaying ", playing);
          if (this.props.media && this.props.media.play) {
            if (playing && !this.props.media.isPlaying) {
              console.log("Starting Playback", playing);
              this.props.media.play();
            }

            if (!playing && this.props.media.isPlaying) {
              console.log("stopping Playback", playing);
              this.props.media.pause();
            }
          }
        }
      });

    gun
      .get(this.props.roomName)
      .get("currentTime")
      .on(currentTime => {
        if (this.isVideo()) {
          // console.log("received currentTime ", currentTime);

          this.gunCurrentTime = currentTime;

          if (this.props.media && this.props.media.seekTo) {
            /* console.log(
            this.props.media.currentTime,
            currentTime,
            Math.abs(this.props.media.currentTime - currentTime),
            Math.abs(this.props.media.currentTime - currentTime) >=
            MAX_TIME_DIFFERENCE
          ); */

            if (
              this.isTimeDifferenceToBig(
                this.props.media.currentTime,
                currentTime
              )
            ) {
              this.props.media.seekTo(currentTime);
            }
          }
        }
      });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.media.currentTime) {
      if (nextProps.media.currentTime - this.gunCurrentTime > 1.7) {
        /* console.log(
          "update gun currentTime: ",
          nextProps.media.currentTime,
          " was: ",
          this.gunCurrentTime
        ); */
        gun
          .get(this.props.roomName)
          .get("currentTime")
          .put(nextProps.media.currentTime);
        return true;
      }
    }

    if (nextProps.media.isPlaying !== this.props.media.isPlaying) {
      console.log("writing isPlaying", nextProps.media.isPlaying);

      gun
        .get(nextProps.roomName)
        .get("isPlaying")
        .once(playing => {
          console.log(
            nextProps.media.isPlaying === playing,
            nextProps.media.isPlaying,
            playing
          );

          if (nextProps.media.isPlaying !== playing) {
            gun
              .get(nextProps.roomName)
              .get("isPlaying")
              .put(nextProps.media.isPlaying);
          }
        });

      return true;
    }

    return nextProps !== this.props;
  }

  render() {
    const { post } = this.props;

    if (!post || post.deleted) {
      return null;
    }

    if (this.isVideo()) {
      return (
        <div className="media">
          <div className="media-player">
            <Player height="420px" src={PR0_VIDEO_URL + post.image} />
          </div>
          <div className="media-controls">
            <div>
              <PlayPause />
            </div>
            <div>
              <MuteUnmute />
            </div>
            <div>
              <Volume />
            </div>
            <div>
              <CurrentTime />/<Duration />
            </div>
            <div>
              <Fullscreen />
            </div>
          </div>

          <style jsx>{`
            .media {
              max-width: 800px;
              margin-left: 10rem;
            }
            .media-player {
              max-width: 800px;
            }
            .media-controls {
              display: flex;
              justify-content: space-evenly;
            }
          `}</style>
        </div>
      );
    }

    return (
      <Fragment>
        <img
          className="Post"
          alt="Benis"
          height="420px"
          src={PR0_IMAGE_URL + post.image}
        />
        <style jsx>{`
          .Post {
            margin-left: 10rem;
          }
        `}</style>
      </Fragment>
    );
  }
}

export default withMediaProps(Post);
