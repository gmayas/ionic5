const express = require('express');
const path = require('path');

const app = express();


app.use(express.static(__dirname + '/ionicApp/www'));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/ionicApp/www/index.html'))
});

app.listen(process.env.PORT || 8100);