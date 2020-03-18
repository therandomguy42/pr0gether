const express = require("express");
const next = require("next");

const querystring = require("querystring");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const Gun = require("gun");

var port = process.env.PORT || 8080;

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(Gun.serve);
    server.use(express.static(__dirname));

    server.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });

    server.get("/room/:id", (req, res) => {
      const actualPage = "/room";
      const queryParams = { title: req.params.id };
      app.render(req, res, actualPage, queryParams);
    });

    server.get("/api/pr0", async (req, res) => {
      const { promoted, currently_shown, flags, user, likes } = req.query;
      console.log(req.query);

      let url = "https://pr0gramm.com/api/items/get";

      let searchParams = {};

      if (typeof promoted !== "undefined" && flags !== "9") {
        searchParams["promoted"] = promoted;
      }

      if (typeof currently_shown !== "undefined") {
        searchParams["id"] = currently_shown;
      }

      if (typeof flags !== "undefined") {
        searchParams["flags"] = flags;
      }

      if (typeof likes !== "undefined") {
        searchParams["likes"] = likes;
        searchParams["self"] = "true";
      }

      if (typeof user !== "undefined") {
        searchParams["user"] = user;
      }
      console.log(searchParams);

      url += "?" + querystring.stringify(searchParams);
      console.log(url);

      let response = await fetch(url, {
        headers: {
          "User-agent": "pr0gramm-api/2.2.0 (Node.js)"
        }
      });

      const posts = await response.json();

      if (posts.error) {
        res.json({ error: posts.error });
        return;
      }

      res.json(posts.items[0]);
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    const instance = server.listen(port, err => {
      if (err) throw err;
      console.log("> Ready on http://localhost:" + port);
    });

    let gunCfg = {
      web: instance
    };

    /**       radisk: false,
      localStorage: false,
      radix: false */

    if (process.env.NODE_ENV === "production") {
      gunCfg = {
        ...gunCfg
        //file: "data"
      };
    } else {
      gunCfg = {
        ...gunCfg
        //file: "data"
        //peers: { "https://pr0gether.herokuapp.com/gun": {} }
      };
    }

    var gun = Gun(gunCfg);
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
