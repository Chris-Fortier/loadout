const express = require("express");
const app = express();
var cors = require("cors");

app.use(cors());

// need one of these for every url route

app.use("/api/v1/users", require("./api/v1/users")); // the route and then the file
app.use("/api/v1/user-loadouts", require("./api/v1/user-loadouts")); // the route and then the file
app.use("/api/v1/loadout-users", require("./api/v1/loadout-users")); // the route and then the file
app.get("/", (req, res) => res.send("Hello World!"));

const port = process.env.PORT || 3060; // use the variable we have for the port or a default port of 3045
app.listen(port, () =>
   console.log(`Server running at listening at http://localhost:${port}`)
);

// go to http://localhost:3060/api/v1/users to see the user object
