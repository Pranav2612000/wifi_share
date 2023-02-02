const express = require('express');
const port = process.env.PORT || 5000;

const app = express();
app.set('trust proxy', true);

app.get('/', (req, res) => {
  res.send({ status: 200 });
});

app.listen(port, () => console.log(`App started on port ${port}`));
