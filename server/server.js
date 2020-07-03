require("dotenv").config();
const mysql = require("mysql"); // import this package

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
connection.query(
   `
   SELECT
      users.email,
      loadouts.name AS loadout_name
   FROM
      users
   INNER JOIN
      xref_user_loadouts ON user_id = users.id
   INNER JOIN
      loadouts ON loadouts.id = xref_user_loadouts.loadout_id
   WHERE
      users.id = '84fbbb78-b2a2-11ea-b3de-0242ac130004'
   `,
   (err, res, fields) => {
      if (err) {
         console.log("err", err);
      } else {
         console.log("res", res);
      }
   }
);

connection.end(); // this stops the server, without this it will just keep running
