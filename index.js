//  for reading .env file
require('dotenv').config();

// app.js
const express = require('express');
const app = express();
var cors = require('cors')
// body parser for passing post request body data
var bodyParser = require('body-parser')
app.use(bodyParser.json());
// using cors
app.use(cors({
  origin:"*"
}))


// calling the routes file
const allRoutes = require("./routes/routes")

app.use("/zara_booking", allRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
