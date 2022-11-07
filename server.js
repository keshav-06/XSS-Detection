const express = require('express')
const { spawn } = require('child_process');
const app = express()
const cors = require('cors')
const port = 3000
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/', (req, res) => {

    console.log(req.query.link)
    var dataToSend;
    // spawn new child process to call the python script
    const python = spawn('python', ['xss_scanner.py', req.query.link]);
    // collect data from script
    python.stdout.on('data', function(data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        res.send(dataToSend)
        console.log(dataToSend)
    });

})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))