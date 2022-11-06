const fs = require('fs');
const { exit } = require('process');



const {stdin} = process;
const output = fs.createWriteStream('02-write-file/output.txt', 'utf-8');
console.log('Введите текст для записи в файл:');

stdin.on('data', (data) => {
    if(data.toString() === 'exit\n') process.exit();

    output.write(data);
});


function bye(){
    console.log("Всего доброго!");
    process.exit();
}
process.on('exit', bye);

process.on("SIGINT", process.exit);
