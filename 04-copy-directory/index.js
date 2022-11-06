const fs = require('fs');
const path = require('path');

fs.rm(path.join('04-copy-directory', 'files-copy'), { recursive: true, force: true }, err => {
    fs.mkdir(path.join('04-copy-directory', 'files-copy'), () => {
        copyDir(path.join('04-copy-directory', 'files'), path.join('04-copy-directory', 'files-copy'));
    });
});





function createFilePath(sourcePath, destinationPath, fileName) {
    let fileSourcePath = path.join(sourcePath, fileName);
    let fileDestinationPath = path.join(destinationPath, fileName);
    createFile(fileSourcePath, fileDestinationPath);
}


function createFile(fileSourcePath, fileDestinationPath) {

    fs.stat(fileSourcePath, (err, stats) => {

        if (stats.isDirectory()) {
            console.log(fileDestinationPath);
            fs.mkdir(fileDestinationPath, { recursive: true }, (err) => { console.log("copy-inside"); copyDir(fileSourcePath, fileDestinationPath) });
        }
        else {
            console.log(fileDestinationPath);
            fs.copyFile(fileSourcePath, fileDestinationPath, (err) => {
                if (err) console.log(err);
                console.log("file copied");
            });
        }
    });
}

function copyDir(sourcePath, destinationPath) {
    fs.readdir(sourcePath, (error, files) => {
        files.forEach((fileName) => {
            createFilePath(sourcePath, destinationPath, fileName);
        });
    });
}

