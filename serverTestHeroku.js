// Run this locally to test the Heroku instance.

var express = require('express');
var app = express();
var path = require('path');
const fetch = require("node-fetch");

app.set('view engine', 'ejs')

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.get('/', function (req, res) {
    res.render('indexTestHeroku');
});



const PORT = process.env.PORT || 1337;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
