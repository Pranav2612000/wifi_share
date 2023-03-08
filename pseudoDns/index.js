const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json({ socketUrl: "https://wifishare-production.up.railway.app/" });
});

app.listen(3001, () => {
    console.log("Listening on port 3001");
});
