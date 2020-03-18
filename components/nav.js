import React from "react";
import Link from "next/link";
import RoomSuggest from "./roomSuggest";
import { mobilecheck } from "./mobilecheck";
import { RichtigesGrau, Menu } from "../constants/colors";

const Nav = () => (
  <nav>
    <div className="navContainer">
      <div>
        <Link prefetch href="/">
          <a>
            <img src="/static/images/icon.svg" height="40px" />
          </a>
        </Link>
      </div>
      {mobilecheck() &&
        "WARNING: Mobile Geräte haben einen 5s delay wenn sie das Video nicht starten."}
      <div>
        <RoomSuggest />
      </div>
    </div>

    <style jsx>{`
      :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
          Helvetica, sans-serif;
        color: #f2f5f4;
        background-color: ${RichtigesGrau};
      }
      .navContainer {
        padding: 4px 0px;
        background: ${Menu};
        display: flex;
        justify-content: space-around;
      }
      .navContainer > img {
        cursor: pointer;
      }
    `}</style>
  </nav>
);

export default Nav;
