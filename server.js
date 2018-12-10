const express = require('express');

const app = express();
const PORT = process.env.port || 3000;

app.use('/scripts', express.static(`${__dirname}/src/scripts`));
app.use('/styles', express.static(`${__dirname}/src/styles`));
app.use('/images', express.static(`${__dirname}/src/resources/images`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`, {} , (err) => {
    if (err) {
      console.log(`error ${err}`);
    } else {
      console.log('Served html file');
    }
  });
});

app.listen(PORT, () => `Started serving on port ${PORT}`);
