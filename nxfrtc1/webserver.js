// silly chrome wants SSL to do screensharing
var fs = require('fs'),
    express = require('express'),
    http = require('http');



var app = express();

app.use(express.static(__dirname));

http.createServer(app).listen(80);

console.log('running on https://localhost:80');
