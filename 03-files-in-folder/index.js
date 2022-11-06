const fs = require('fs');
const path = require('path');

const folderPath = path.join('03-files-in-folder', 'secret-folder');
let folderInside = fs.readdirSync(folderPath);

folderInside = folderInside.forEach((fileName) => {
    let filePath = path.join(folderPath, fileName);
    let fileStat = fs.statSync(filePath);
    if(fileStat.isFile()){
        console.log(`${fileName.split('.')[0]} - ${fileName.split('.')[1]} - ${fileStat.size / 1000}kb`);
    }
})




