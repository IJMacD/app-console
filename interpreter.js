const BUILTINS = {
    ver: () => process.env.REACT_APP_COMMIT_HASH || require('./package.json').version,
    help: () => `Command Interpreter version ${BUILTINS['ver']()}\n© Iain MacDonald\n\nBuiltin commands:\n${Object.keys(BUILTINS).sort().join("\n")}`,
    date: () => new Date(),
    type: v => v instanceof Date ? "date" : (Array.isArray(v) ? "list" : typeof v),
    sleep: n => new Promise(r => setTimeout(r, n * 1000)),
    echo: (...a) => a.map(toString).join(" "),
    alert: (...a) => alert(BUILTINS['echo'](...a)),
    cast: (v,t) => t === "number" ? +v : (t === "string" ? toString(v) : v),
    length: v => (Array.isArray(v) ? v : (typeof v === "string" ? v.split("\n") : [v])).length,
};

export default class Interpreter {
    constructor (context) {
        this.context = context;
    }

    /**
     * 
     * @param {string} input 
     */
    async execute (input, output, error) {
        if (typeof this.context.variables === "undefined") {
            this.context.variables = {};
        }

        const { variables } = this.context;

        try {
            const tokens = tokenise(input);

            if (tokens.length === 0) return;

            const statements = parse(tokens);

            for (const statement of statements) {
                try {
                    const result = await run.call(this, statement);
                    output(toString(result));
                    variables[0] = result;
                } catch (e) {
                    error(e.message);
                }
            }
        } catch (e) {
            error("Error parsing: " + e.message);
        }
    }
}

/**
 * 
 * @param {any} value 
 * @returns {string}
 */
function toString (value) {
    if (typeof value === "undefined" || value === null) return "";
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) return value.map(toString).join("\n");
    return String(value);
}

async function run (statement) {
    const { executables = {} } = this.context;

    if (typeof statement === "number") return statement;

    if (typeof statement === "string") return statement;

    if (typeof statement.variable !== "undefined") return getVariable.call(this, statement.variable);

    if (statement.type === "assignment") {
        return setVariable.call(this, statement.name, await run.call(this, statement.value));
    }

    let { command, args } = statement;
    
    // Find any sub-expressions i.e ${...}
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (typeof arg === "object") {
            let val;

            if (arg.command)
                val = await run.call(this, arg);
            else if (arg.variable)
                val = await getVariable.call(this, arg.variable);
            else
                throw Error("Unkown input");

            args[i] = val;
        }
    }

    if (command === "get") {
        return getVariable.call(this, ...args);
    }

    if (command === "set") {
        return setVariable.call(this, ...args);
    }

    if (command in BUILTINS) {
        return BUILTINS[command](...args);
    }

    if (command in executables) {
        return executables[command](...args);
    }

    throw Error(`Command '${command}' not found`);
};

async function getVariable (name) {
    const { executables = {}, variables = {} } = this.context;

    if ('get' in executables) {
        try {
            const result = await executables.get(name);
            return result;
        } catch (e) {}
    }

    if (name in variables) return variables[name];
}

async function setVariable (name, value) {
    const { executables = {}, variables = {} } = this.context;

    if ('set' in executables) {
        try {
            const result = await executables.set(name, value);
            return result;
        } catch (e) {}
    }

    variables[name] = value;
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
            value: v => v.replace(/\\n/g, "\n").replace(/\\t/g, "\t"),
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
            regex: /^(;|\${|}|\||=)/,
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
    const statements = splitTokens(tokens, ";").map(parseStatement);

    return statements;
}

function parseStatement (tokens) {
    const pipes = [];

    let items = [];

    const makeNode = items => {
        if (typeof items[0] === "number") return items[0];

        if (typeof items[0].variable !== "undefined") return items[0];

        if (items.length === 3 && typeof items[0] === "string" && items[1] === "=") {
            return {
                type: "assignment",
                name: items[0],
                value: items[2],
            };
        }

        const [ command, ...args ] = items;
        return { command, args };
    };
    
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t === "|") {
            pipes.push(makeNode(items));
            items = [];
        }
        else if (t === "${") {
            const tail = tokens.slice(i+1);
            const end = tail.indexOf("}");
            if (end === -1) throw Error("Unterminated sub-expression");
            items.push(parseStatement(tail.slice(0, end)));
            i += end + 1;
        } 
        else if (typeof t === "number") {
            items.push(t);
        }
        else if (typeof t === "string" && t.startsWith("$")) {
            items.push({ variable: t.substr(1) });
        }
        else items.push(t);
    }

    if (items.length === 0) throw Error("Empty pipe segment");

    pipes.push(makeNode(items));
    
    return pipes.reduce((prev, curr) => {
        if (prev === null) return curr;

        curr.args.unshift(prev);

        return curr;
    }, null);
}

/**
 * @param {string[]} tokens
 * @param {string} separator
 * @returns {string[][]}
 */
function splitTokens (tokens, separator) {
    const out = [];
    let current = [];
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i] === separator && current.length) {
            out.push(current);
            current = [];
        } else current.push(tokens[i]);
    }
    if (current.length) out.push(current);
    return out;
}
