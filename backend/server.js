const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send({ status: 200 });
});

app.listen(port, () => console.log(`App started on port ${port}`));
