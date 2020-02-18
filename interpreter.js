const BUILTINS = {
    ver: () => process.env.REACT_APP_COMMIT_HASH || require('./package.json').version,
    help: () => `Command Interpreter version ${BUILTINS['ver']()}\n© Iain MacDonald\n\nBuiltin commands:\n${BUILTINS['commands']().join("\n")}`,
    commands: () => [...Object.keys(BUILTINS),"get","set"].sort(),
    variables () { return Object.keys(this.context.variables); },
    get: getVariable,
    set: setVariable,
    date: () => new Date(),
    type: v => v instanceof Date ? "date" : (Array.isArray(v) ? "list" : (v === null ? "": typeof v)),
    sleep: n => new Promise(r => setTimeout(r, n * 1000)),
    echo: (...a) => a.map(toString).join(" "),
    alert: (...a) => alert(BUILTINS['echo'](...a)),
    cast: (v,t) => {
        if (t === "number") return +v;
        if (t === "string") return toString(v);
        if (t === "list" && typeof v === "string") return v.split("\n");
        return v;
    },
    length: v => (Array.isArray(v) ? v : (typeof v === "string" ? v.split("\n") : [v])).length,
    json: (...a) => a.length === 0 ? null : (a.length === 1 ? JSON.stringify(a[0]) : JSON.stringify(a)),
    range: n => [...Array(n)].map((n,i) => i),
};

const CONTROL = ["foreach","done"];
const OPERATORS = ["+","-","*","/"];

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

        try {
            const tokens = tokenise(input);

            if (tokens.length === 0) return;

            const statements = parse(tokens);
            
            try {
                await this.executeStatements(statements, output, error);
            } catch (e) {
                error(e.message);
            }
        } catch (e) {
            error("Error parsing: " + e.message);
        }
    }

    /**
     * 
     * @param {StatementNode[]} statements 
     * @param {(output: string) => void} output 
     * @param {(error: string) => void} error 
     */
    async executeStatements(statements, output, error) {
        const { variables } = this.context;

        for (let i = 0; i < statements.length; i++) {

            const statement = statements[i];
            if (statement.control === "foreach") {
                const items = BUILTINS['cast'](await run.call(this, statement.args[0]), "list");
                this.context.forLoop = {
                    originalItem: variables.item,
                    start: i,
                    items,
                    iteration: 0,
                };
                
                if (items.length === 0) {
                    const idx = statements.slice(i + 1).findIndex(s => s.control === "done");
                    i = (idx === -1) ? statements.length : idx;
                    continue;
                }

                variables.item = items[0];
            }
            else if (statement.control === "done") {
                if (this.context.forLoop) {
                    this.context.forLoop.iteration++;
                    if (this.context.forLoop.iteration < this.context.forLoop.items.length) {
                        i = this.context.forLoop.start;
                        variables.item = this.context.forLoop.items[this.context.forLoop.iteration];
                    }
                    else {
                        if (typeof this.context.forLoop.originalItem === "undefined") {
                            delete variables.item;
                        }
                        else {
                            variables.item = this.context.forLoop.originalItem;
                        }
                        this.context.forLoop = null;
                    }
                }
                else {
                    throw Error(`Unexpected control word: ${statement.control}`);
                }
            }
            else {
                await this.executeStatement(statement, output, error);
            }
        }
    }

    async executeStatement(statement, output, error) {
        const { variables } = this.context;

        try {
            const result = await run.call(this, statement);
            output(toString(result));
            variables[0] = result;
        }
        catch (e) {
            error(e.message);
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

    if (typeof statement !== "object") return statement;

    // e.g. $$variable
    if (typeof statement.variable === "object") return getVariable.call(this, await run.call(this, statement.variable));

    if (typeof statement.variable === "string") return getVariable.call(this, statement.variable);

    if (typeof statement.operator === "string") {
        if (statement.operator === "=")
            return setVariable.call(this, statement.name, await run.call(this, statement.value));
        
        const left = await run.call(this, statement.left);
        const right = await run.call(this, statement.right);

        switch (statement.operator) {
            case "+": return left + right;
            case "-": return left - right;
            case "*": return left * right;
            case "/": return left / right;
        }

        throw Error(`Unrecognised operator: ${statement.operator}`);
    }

    let { command, args } = statement;

    const evaldArgs = await Promise.all(args.map(arg => {
        if (typeof arg === "object") {
            return run.call(this, arg);
        }

        return arg;
    }));

    if (command in BUILTINS) {
        return BUILTINS[command].call(this,...evaldArgs);
    }

    if (command in executables) {
        return executables[command].call(this, ...evaldArgs);
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

    try {
        variables[name] = value;
    } catch (e) {
        throw Error(`${name} is readonly`);
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
            value: v => v.replace(/\\n/g, "\n").replace(/\\t/g, "\t"),
        },
        {
            name: "num",
            regex: /^-?\d+(?:\.\d+)?/,
            value: v => +v,
        },
        {
            name: "variable",
            regex: /^\$+\w+/,
        },
        {
            name: "boolean",
            regex: /^(true|false)/,
            value: v => v === "true",
        },
        {
            name: "punctuation",
            regex: /^(;|\${|}|[|=+*/-])/,
        },
        {
            name: "keyword",
            regex: /^(foreach|done)/,
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

function makeNode (items) {
    if (items.length === 3 && typeof items[0] === "string" && items[1] === "=") {
        return {
            operator: "=",
            name: items[0],
            value: items[2],
        };
    }

    if (items.length === 3 && OPERATORS.includes(items[1])) {
        return {
            operator: items[1],
            left: items[0],
            right: items[2],
        };
    }

    if (typeof items[0].variable !== "undefined") {
        if (items.length > 1)
            throw Error("Variable evaluation must be only node in statement");
        return items[0];
    }

    if (typeof items[0] === "number")
        return items[0];

    if (CONTROL.includes(items[0])) {
        const [control, ...args] = items;
        return { control, args };
    }

    const [command, ...args] = items;
    return { command, args };
}

function parseStatement (tokens) {
    const pipes = [];

    let items = [];
    
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
        else if (typeof t === "string" && t[0] === "$") {
            let name = t.substr(1);
            let item = { variable: name };
            
            // Only two levels deep for $$variables
            if (name[0] === "$") {
                item = {
                    variable: {
                        variable: name.substr(1),
                    },
                };
            }

            items.push(item);
        }
        else items.push(t);
    }

    if (items.length === 0) throw Error("Empty pipe segment");

    pipes.push(makeNode(items));
    
    return pipes.reduce((prev, curr) => {
        if (prev === null) return curr;

        if (!curr.args) {
            throw Error(`Unable to pipe to ${typeof curr.variable !== "undefined" ? "variable" : typeof curr}`);
        }

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
