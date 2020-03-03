import Console from './console';
import ShellImport from './shell';
export const Shell = ShellImport;
export { ShellImport as Interpreter }; // Backwards compat
export default Console;