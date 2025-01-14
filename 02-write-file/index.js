const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(path.join(__dirname, 'output.txt'), {
  flags: 'a',
});

console.log(
  'Enter text to write to the file. Type "exit" or press Ctrl+C to quit.',
);

process.stdin.on('data', (data) => {
  const input = data.toString().trim();

  if (input.toLowerCase() === 'exit') exitProgram();
  else {
    writeStream.write(input + '\n', (err) => {
      if (err) console.error('Unexpected error when writing:', err);
    });
  }
});

process.on('exit', exitProgram);

function exitProgram() {
  console.log('Thank you for using the program. Goodbye!');
  writeStream.end();
  process.exit();
}
