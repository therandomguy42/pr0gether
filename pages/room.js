import React, { Component } from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Post from "../components/post";
import { Media } from "react-media-player";
import validUrl from "valid-url";
import { connect } from "react-redux";
import { fetchFromPro } from "../components/fetchFromPro";
import { setRoom, setPost } from "../lib/actions";
import { RichtigesGrau, Suche } from "../constants/colors";
import Capitalize from "../lib/capitalize";
import sendNotification from "../lib/nothification";
import { PR0_THUMB_URL } from "../constants";

class Room extends Component {
  constructor(props) {
    super(props);

    gun.get(props.name).on(async room => {
      this.props.setRoom(room);
      if (this.currently_shown !== room.currently_shown) {
        this.currently_shown = room.currently_shown;
        const post = await fetchFromPro(room);

        if (this.props.post.image !== "") {
          console.log(post);
          sendNotification(`Neuer Post!`, {
            body: `von ${post.user} mit ${post.up - post.down} Benis`,
            icon: `${PR0_THUMB_URL}${post.thumb}`
          });
        }

        this.props.setPost(post);
      }
    });
  }

  currently_shown = 0;

  static async getInitialProps(context) {
    return { name: context.query.title };
  }

  onPostSuggest = async e => {
    if (validUrl.isWebUri(e.target.value)) {
      const url = e.target.value;

      let payload = {};

      if (url.match(/\/(top)\//)) {
        payload.promoted = 1;
      }

      if (url.match(/\/(new)\//)) {
        payload.promoted = null;
      }

      if (url.match(/user\/(\w+)\//)) {
        const match = url.match(/user\/(\w+)\//);
        payload.user = match[1];
        payload.promoted = null;

        if (url.match(/likes\//)) {
          payload.likes = payload.user;
        } else {
          payload.likes = null;
        }

        if (url.match(/uploads\//)) {
          payload.promoted = null;
        } else {
          payload.flags = null;
        }
      } else {
        payload.user = null;
        payload.likes = null;
        payload.flags = null;
      }

      if (url.match(/\/(\w+)$/)) {
        const match = url.match(/\/(\w+)$/);
        payload.currently_shown = match[1];
      }
      console.log(payload);

      gun.get(this.props.name).put({
        name: this.props.name,
        currentTime: 0,
        isPlaying: false,
        ...payload
      });
      this.input.value = "";
    }
  };

  render() {
    const { room, post, name } = this.props;

    if (!room || !post) {
      return null;
    }

    const capitalizedName = Capitalize(name);

    return (
      <div className="marginBottom">
        <Head title={capitalizedName} />
        <Nav />

        <div className="roomHeading">
          <div className="left">
            <div>{capitalizedName}</div>
          </div>

          <div className="right">
            {/* <div>Nächster Post</div> */}
            <input
              ref={el => (this.input = el)}
              type="text"
              className="suggestPost"
              placeholder="Post vorschlagen"
              onChange={this.onPostSuggest}
            />
          </div>
        </div>

        <Media>
          <Post
            post={post}
            roomName={name}
            postId={room.currently_shown}
            isPromoted={!!room.promoted}
          />
        </Media>
        <br />

        <style jsx>{`
          .suggestPost {
            height: 36px;
            padding-left: 10px;
            padding-right: 10px;
            background-color: ${Suche};
            border: 1px solid ${RichtigesGrau};
            border-radius: 4px;
          }

          .roomHeading {
            margin-bottom: 2.5rem;
            padding: 0 10rem;
            display: flex;
            flex-direction: row;
          }

          .roomHeading > .left {
            width: 50%;
            padding: 1rem 0;
          }

          .roomHeading > .left > div {
            font-size: 35px;
          }

          .roomHeading > .right {
            width: 50%;
            text-align: right;
            padding: 1rem 0;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    room: state.current_room,
    post: state.current_post
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoom: data => dispatch(setRoom(data)),
    setPost: data => dispatch(setPost(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Room);
