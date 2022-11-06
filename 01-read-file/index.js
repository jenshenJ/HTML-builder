const fs = require('fs');
const path = require('path');
const readableStream = fs.createReadStream(path.join('01-read-file', 'text.txt'), 'utf-8');

readableStream.on('data', (data) => console.log(data))