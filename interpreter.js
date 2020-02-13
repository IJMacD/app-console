const BUILTINS = {
    ver: () => "1.0.0",
    help: () => `Command Interpreter ver ${BUILTINS.ver()}\n© Iain MacDonald\n\nBuiltin commands:\n${Object.keys(BUILTINS).sort().join("\n")}`,
    date: () => (new Date()).toISOString(),
    type: v => typeof v,
    sleep: n => new Promise(r => setTimeout(r, n * 1000)),
    echo: (...a) => a.join(" "),
};

export default class Interpreter {
    constructor (context) {
        this.context = context;
    }

    /**
     * 
     * @param {string} input 
     */
    async execute (input, outputCallback) {
        const { executables = {}, variables = {} } = this.context;

        const run = async (cmd) => {
            let { command, args } = cmd;

            if (typeof command === "object" && command.variable) {
                if (args.length) throw Error("Unexpected input: " + (typeof args[0] === "object" ? `$${args[0].variable}` : args[0]));
                return variables[command.variable];
            }
            
            if (typeof command === "number") return command;
            
            // Find any sub-expressions i.e ${...}
            for (let i = 0; i < args.length; i++) {
                const arg = args[i];
                if (typeof arg === "object") {
                    let val;

                    if (arg.command)
                        val = await run(arg);
                    else if (arg.variable)
                        val = variables[arg.variable];
                    else
                        throw Error("Unkown input");

                    args[i] = val;
                }
            }

            if (command in BUILTINS) {
                return BUILTINS[command](...args);
            }

            if (command in executables) {
                return executables[command](...args);
            }

            throw Error(`Command '${command}' not found`);
        };

        const tokens = tokenise(input);

        if (tokens.length === 0) return;

        const cmds = parse(tokens);

        for (const cmd of cmds) {
            try {
                const output = await run(cmd);
                outputCallback(output);
                variables[0] = output;
            } catch (e) {
                outputCallback(null, e.message);
            }
        }
    }
}

/**
 * 
 * @param {string} text 
 * @returns {string[]}
 */
function tokenise (text) {
    const tokens = [];
    let i = 0;

    const matchers = [
        {
            name: "whitespace",
            regex: /^\s+/,
            value: () => "",
        },
        {
            name: "string",
            regex: /^"([^"]*)"/,
        },
        {
            name: "num",
            regex: /^-?\d+(?:\.\d+)?/,
            value: v => +v,
        },
        {
            name: "variable",
            regex: /^\$\w+/,
        },
        {
            name: "boolean",
            regex: /^(true|false)/,
            value: v => v === "true",
        },
        {
            name: "punctuation",
            regex: /^(;|\${|})/,
        },
        {
            name: "name",
            regex: /^\w+/,
        },
    ]

    while (i < text.length) {
        const tail = text.substr(i);

        let done = false;

        for (const m of matchers) {
            const match = m.regex.exec(tail);
            if (match) {
                let val = match[1] || match[0];

                if (m.value instanceof Function) {
                    val = m.value(val);
                } else if (typeof m.value !== "undefined") {
                    val = m.value;
                }

                if (typeof val !== "undefined" && val !== null && val !== "")
                    tokens.push(val);

                i += match[0].length;
                done = true;
                break;
            }
        }

        if (!done) {
            throw Error(`Unexpected input at ${i}: ${text.substr(i, 10)}`);
        }
    }

    return tokens;
}

/**
 * 
 * @param {string[]} tokens 
 */
function parse (tokens) {
    const commands = [];
    let command = [];

    const parseCommand = list => { const [ command, ...args ] = list; return { command, args } };

    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t === ";") {
            commands.push(parseCommand(command));
            command = [];
        }
        else if (t === "${") {
            const tail = tokens.slice(i+1);
            const end = tail.indexOf("}");
            command.push(parse(tail.slice(0, end))[0]);
            i += end + 1;
        } 
        else if (typeof t === "number") {
            command.push(t);
        }
        else if (typeof t === "string" && t.startsWith("$")) {
            command.push({ variable: t.substr(1) });
        }
        else command.push(t);
    }

    if (command.length) commands.push(parseCommand(command));

    return commands;
}