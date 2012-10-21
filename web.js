var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
    response.sendfile(__dirname + '/index.html');
});

app.configure(function() {
    app.use('/css', express.static(__dirname + '/css'));
    app.use('/fonts', express.static(__dirname + '/fonts'));
    app.use('/images', express.static(__dirname + '/images'));
    app.use('/js', express.static(__dirname + '/js'));
});

var port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log('Listening on ' + port);
});

