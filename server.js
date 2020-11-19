const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 8000;
const app = express();

const User = require("./models/User");
mongoose.connect("mongodb://localhost/userData", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log("database connected"));

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`server is listening on port:${port}`)
});

function sendResponse(res, err, data) {
  if (err) {
    res.json({ success: false, message: err });
  } else if (!data) {
    res.json({ success: false, message: "Not found" });
  } else {
    res.json({ success: true, data });
  }
}

// CREATE
app.post('/users', (req, res) => {
  const { name, email, password } = req.body.newData;
  User.create({
    name,
    email,
    password,
  }, (err, data) => sendResponse(res, err, data))
})

app.route('/users/:id')
  // READ
  .get((req, res) => {
    User.findById(req.params.id, (err, data) => sendResponse(res, err, data));
  })
  // UPDATE
  .put((req, res) => {
    const {
      params: { id },
      body: { newData: { name, email, password } }
    } = req;
    User.findByIdAndUpdate(id, { name, email, password }, { new: true }, (err, data) => sendResponse(res, err, data));
  })
  // DELETE
  .delete((req, res) => {
    const { id } = req.params;
    User.findByIdAndDelete(id, (err, data) => sendResponse(res, err, data));
  })