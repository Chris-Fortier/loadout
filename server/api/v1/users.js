// The users resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectUser = require("../../queries/selectUser");
const { toJson, toSafeParse } = require("../../utils/helpers");

// @route      GET api/v1/users
// @desc       Get a valid user via email and password
// @access     Public
router.get("/", (req, res) => {
   db.query(selectUser("mike@gmail.com", "18126E7BD3F84B3F3E4DF094DEF5B7DE"))
      .then((dbRes) => {
         // successful response
         const user = toSafeParse(toJson(dbRes))[0]; // converts the response to a single user object
         console.log(user);
         res.json(user);
      })
      .catch((err) => {
         // report error to the user
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
