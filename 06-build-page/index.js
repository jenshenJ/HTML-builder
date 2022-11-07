const fs = require('fs');
const path = require('path');
const readline = require('readline');


let folderPath = path.join('06-build-page', 'styles')

let bundlePath = path.join('06-build-page', 'project-dist', 'style.css');



fs.readdir(folderPath, (err, files) => {
  styleFiles = [];
  (function loop(i) {
    if (i === files.length) {
      fs.mkdir(path.join('06-build-page', 'project-dist'), () => {
        //create bundle of stylefiles
        const bundleStream = fs.createWriteStream(bundlePath);
        mergeStreams(styleFiles, bundleStream);

        //create index.html file
        const componentsPath = path.join('06-build-page', 'components');
        fs.readdir(componentsPath, (err, components) => {
          resultHTML = [];
          const templateHTML = readline.createInterface({
            input: fs.createReadStream(path.join('06-build-page', 'template.html'), 'utf-8'),
            output: process.stdout,
            terminal: false
          });
          const indexHTML = fs.createWriteStream(path.join('06-build-page', 'project-dist', 'index.html'));


          templateHTML.on('line', (line) => {
            resultHTML.push(line);
          });

          templateHTML.input.on('end', () => {
            (function writeLine(i) {
              if(i === resultHTML.length) return;
              line = resultHTML[i];
              if (line.match(/{{.*}}/gm)) {
                let componentName = "";
                for (c of line) {
                  if (c !== ' ' && c !== '{' && c !== "}") componentName += c;

                }
                let spaces = ' ';
                for(c of line){
                  if(c === ' ') spaces += ' ';
                  else break;
                }
                for (component of components) {
                  if (component.split('.')[0] === componentName) {
                    let componentPath = path.join(componentsPath, component);


                    const componentHTML = readline.createInterface({
                      input: fs.createReadStream(componentPath, 'utf-8'),
                      output: process.stdout,
                      terminal: false
                    });

                    componentHTML.on('line', (lineInside) => {
                      indexHTML.write(spaces + lineInside + '\n');
                    });
                    componentHTML.input.on('end', () => {
                      writeLine(i + 1);
                    })


                  }
                }
              }
              else{
                indexHTML.write(resultHTML[i] + '\n');
                writeLine(i + 1);
              }
            })(0);
          })
        });



        //copying assets into project-dist directory
        fs.rm(path.join('06-build-page', 'project-dist', 'assets'), { recursive: true, force: true }, err => {
          fs.mkdir(path.join('06-build-page', 'project-dist', 'assets'), () => {
            copyDir(path.join('06-build-page', 'assets'), path.join('06-build-page', 'project-dist', 'assets'));
          });
        });


      })

    } else {
      filePath = path.join(folderPath, files[i]);
      if (path.extname(filePath)) {
        fs.stat(filePath, (err, fileStat) => {
          styleFiles.push(filePath);
          loop(i + 1);
        });
      }
    }
  })(0);
})










function mergeStreams(styles = [], bundleStream) {
  if (!styles.length) {
    return bundleStream.end();
  }


  const currentFile = styles.shift();
  const currentReadStream = fs.createReadStream(currentFile, 'utf-8');



  currentReadStream.pipe(bundleStream, { end: false });

  currentReadStream.on('end', function () {

    mergeStreams(styles, bundleStream);
  })

  currentReadStream.on('error', (error) => {
    console.log(error);
    bundleStream.close();
  });

}




function createFilePath(sourcePath, destinationPath, fileName) {
  let fileSourcePath = path.join(sourcePath, fileName);
  let fileDestinationPath = path.join(destinationPath, fileName);
  createFile(fileSourcePath, fileDestinationPath);
}


function createFile(fileSourcePath, fileDestinationPath) {

  fs.stat(fileSourcePath, (err, stats) => {

    if (stats.isDirectory()) {

      fs.mkdir(fileDestinationPath, { recursive: true }, (err) => { copyDir(fileSourcePath, fileDestinationPath) });
    }
    else {

      fs.copyFile(fileSourcePath, fileDestinationPath, (err) => {
        if (err) console.log(err);

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



