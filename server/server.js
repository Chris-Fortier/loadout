require("dotenv").config();
const mysql = require("mysql"); // import this package
const selectUser = require("./queries/selectUser");
const selectUserLoadouts = require("./queries/selectUserLoadouts");
const { toJson, toSafeParse } = require("./utils/helpers");

const connection = mysql.createConnection({
   host: process.env.RDS_HOST,
   user: process.env.RDS_USER,
   password: process.env.RDS_PASSWORD,
   database: "loadout_app", // the name of the database in MySQL
});

connection.connect();

// example query
// npm start in server folder will return objects from AWS RDS
// npm start in project folder will run the client

// returns a user
connection.query(
   selectUser("mike@gmail.com", "18126E7BD3F84B3F3E4DF094DEF5B7DE"),
   (err, res) => {
      if (err) {
         console.log("err", err);
      } else {
         const user = toSafeParse(toJson(res))[0]; // converts the response to a single user object
         console.log(user);
      }
   }
);

// // returns user loadouts for a given user
// connection.query(
//    selectUserLoadouts("84fbbb78-b2a2-11ea-b3de-0242ac130004"),
//    (err, res) => {
//       if (err) {
//          console.log("err", err);
//       } else {
//          const user = toSafeParse(toJson(res)); // converts the response to a single user object
//          console.log(user);
//       }
//    }
// );

connection.end(); // this stops the server, without this it will just keep running
