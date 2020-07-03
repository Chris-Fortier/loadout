// The user loadouts resource
const express = require("express");
const router = express.Router();
const db = require("../../db");
const selectUserLoadouts = require("../../queries/selectUserLoadouts"); // change this

// @route      GET api/v1/user-loadouts (http://localhost:3045/api/v1/user-loadouts)  // change this
// @desc       Get all user loadouts for a user
// @access     Public
router.get("/", (req, res) => {
   // change this
   db.query(selectUserLoadouts("84fbbb78-b2a2-11ea-b3de-0242ac130004"))
      .then((dbRes) => {
         // successful response
         console.log(dbRes);
         res.json(dbRes);
      })
      .catch((err) => {
         // report error
         console.log(err);
         res.status(400).json(err);
      });
});

module.exports = router;
