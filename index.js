const express = require("express"); // common js modules, import express from 'express': es2015 module.
const bodyParser = require("body-parser");
const app = express(); // listen for incoming request

app.use(bodyParser.json());

// API routes
require("./routes/pingRoute")(app);
require("./routes/postRoute")(app);

const PORT = process.env.PORT || 5000; // not to be changed likely
app.listen(PORT); // localhost:5000
