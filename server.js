const http = require('http');

const port = 5000;

//## imported our app
const app = require('./app');

//## By using http library i have create a server 
const server = http.createServer(app);

//## listening the server
server.listen(port,()=>{
    console.log(`Mentor mentee server is Connected on ${port}`);
});