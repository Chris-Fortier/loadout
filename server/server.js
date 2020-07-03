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
connection.query("SELECT 1 + 1 AS solution", (error, results, fields) => {
   if (error) {
      console.log(error);
   } else {
      console.log("The solution is: ", results[0].solution);
   }
});

connection.end();
