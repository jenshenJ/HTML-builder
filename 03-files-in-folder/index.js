const fs = require('fs');
const path = require('path');

fs.promises.readdir(path.join('03-files-in-folder', 'secret-folder'));