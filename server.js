var express = require(‘express’);

var app = express();
let http = require("http");
const host= ""; //aws server
const port =""; // if port no.s are appplicable (referencing from a local way of doing it, but think a port should be specified)
const server = http.createServer(/* insert a listener*/);
server.listen(port,host,()=>{console.log('aws server running on http://')})
/*
var server = app.listen(3000, () => {
 console.log(‘server is running on port’, server.address().port);
});
*/

app.use(express.static(__dirname));