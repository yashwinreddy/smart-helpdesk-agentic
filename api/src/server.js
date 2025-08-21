require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});
