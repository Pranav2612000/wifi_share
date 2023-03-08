const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json({ socketUrl: "https://wifishare-production.up.railway.app/" });
});

module.exports = app;
