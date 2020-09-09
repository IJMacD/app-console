import Shell from './shell.js';
const shell = new Shell();
shell.execute(process.argv.slice(2).join(" "), console.log, console.error);