const http = require('http');

const s = http.createServer((req,res) => {
    console.log(req._readableState.objectMode);
    console.log(process.env);
    res.end('Selesai');
})

const p = 4000;

s.listen(p, () => console.log(`Server is running on port ${p}`));