// The loadout users resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectLoadoutUsers = require("../../queries/selectLoadoutUsers"); // change this

// @route      GET api/v1/loadout-users (http://localhost:3045/api/v1/loadout-users)  // change this
// @desc       Get all user loadouts for a user
// @access     Public
router.get("/", (req, res) => {
   console.log("req.query", req.query);
   const loadoutId = req.query.loadoutId; // put the query into some consts (destructoring es6)

   // change this
   // db.query(selectLoadoutUsers(loadoutId))
   // https://www.npmjs.com/package/mysql#escaping-query-values
   db.query(selectLoadoutUsers, [loadoutId]) // this syntax style prevents hackers
      .then((dbRes) => {
         // successful response
         // console.log(dbRes);
         res.json(dbRes);
      })
      .catch((err) => {
         // report error
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
