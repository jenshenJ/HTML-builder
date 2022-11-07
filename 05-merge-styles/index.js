const fs = require('fs');
const path = require('path');


let folderPath = path.join('05-merge-styles', 'styles')

let bundlePath = path.join('05-merge-styles','project-dist','bundle.css');
let files = fs.readdirSync(folderPath);

styleFiles = files.filter((filename) => {
    let filePath = path.join(folderPath, filename);
    let fileStat = fs.statSync(filePath);
    return fileStat.isFile() && path.extname(filePath) === '.css';
})


styleFilesPath = styleFiles.map((fileName) => {
    return path.join(folderPath, fileName);
})


function mergeStreams(styles=[], bundleStream){
    if(!styles.length){
        return bundleStream.end();
    }

    console.log(styles);
    const currentFile = styles.shift();
    const currentReadStream = fs.createReadStream(currentFile, 'utf-8');

    
    
    currentReadStream.pipe(bundleStream, {end: false});

    currentReadStream.on('end', function(){
        
        mergeStreams(styles, bundleStream);
    })

    currentReadStream.on('error', (error) => {
        console.log(error);
        bundleStream.close();
    });

}



const bundleStream = fs.createWriteStream(bundlePath);


mergeStreams(styleFilesPath, bundleStream);

