const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/api", (req, res) => {
    res.json({ socketUrl: "https://wifi-share-api.onrender.com/" });
});

module.exports = app;
