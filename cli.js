import Interpreter from './shell.js';
const shell = new Interpreter();
shell.execute(process.argv.slice(2).join(" "), console.log, console.error);