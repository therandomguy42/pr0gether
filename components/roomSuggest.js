import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import Router from "next/router";
import { connect } from "react-redux";
import { setRoom } from "../lib/actions";
import { Suche, pr0grammOrange } from "../constants/colors";

class RoomSuggest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      rooms: [],
      suggestions: []
    };
  }

  async componentDidMount() {
    gun.get("rooms").on(rooms => {
      const roomList = Object.keys(rooms)
        .filter((item, key) => {
          if (item !== "_") {
            return item;
          }
        })
        .map((room, val) => {
          return { name: room };
        });

      this.setState({ rooms: roomList, suggestions: roomList });
    });

    var timeout = setTimeout(() => {
      if (this.state.rooms) {
        this.addRoom();
      }
      clearTimeout(timeout);
    }, 1000);
  }

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputValue === "all") {
      return this.state.rooms;
    }

    return inputLength === 0
      ? []
      : this.state.rooms.filter(
          room => room.name.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = async (
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) => {
    this.navigateTo(suggestion.name);
  };

  navigateTo = target => {
    const targetPage = "/room/" + target;
    Router.push(targetPage, targetPage, {
      shallow: true
    });
  };

  renderSuggestion = suggestion => <div>{suggestion.name}</div>;
  getSuggestionValue = suggestion => suggestion.name;

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  addRoom = () => {
    let newRoomName = this.state.value;

    if (
      !newRoomName &&
      this.state.rooms.length === 0 &&
      typeof window !== "undefined"
    ) {
      newRoomName = Math.random() > 0.5 ? "Cha0s" : "Gamb";
    }

    if (newRoomName && newRoomName !== "all") {
      const defaultRoom = {
        name: newRoomName,
        currentTime: 0,
        currently_shown: 879293,
        isPlaying: false,
        promoted: 0,
        user: "cha0s"
      };

      gun
        .get("rooms")
        .get(newRoomName)
        .not(name => {
          gun.get("rooms").set(gun.get(name).put(defaultRoom));

          this.props.dispatch(setRoom(defaultRoom));

          // navigate to page after creation
          this.navigateTo(newRoomName);
        });
    }
  };

  renderContent = () => {
    if (this.state.rooms.length === 0) {
      return null;
    }

    return (
      <div>
        <link href="/static/rooms.css" rel="stylesheet" async />
        <div className="rooms">
          <Autosuggest
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionSelected={this.onSuggestionSelected}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            highlightFirstSuggestion={true}
            inputProps={{
              value: this.state.value,
              onChange: this.onChange,
              placeholder: "Raum Suchen",
              maxLength: "20"
            }}
          />
          {this.state.suggestions.length === 0 && this.state.value !== "" ? (
            <button
              className="suggestInput"
              type="button"
              onClick={this.addRoom}
            >
              +
            </button>
          ) : (
            <div className="fakeButton">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
          )}
        </div>

        <style jsx>{`
          .rooms {
            display: flex;
            flex-direction: row;
          }
          .fakeButton {
            width: 34px;
          }
          .suggestInput {
            background-color: ${Suche};
            border: 1px solid #161618;
            border-bottom-right-radius: 4px;
            border-top-right-radius: 4px;
            padding: 0px 12px;
            width: 34px;
          }
          .suggestInput:hover {
            background-color: ${pr0grammOrange};
          }
        `}</style>
      </div>
    );
  };

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default connect()(RoomSuggest);
