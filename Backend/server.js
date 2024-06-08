const mongoose = require('mongoose');
const { port, mongoURI } = require('./config');
const app = require('./app');

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});