const BUILTINS = {
    ver: () => process.env.REACT_APP_COMMIT_HASH || require('../package.json').version,
    help: () => `Command Interpreter version ${BUILTINS['ver']()}\n© Iain MacDonald\n\nBuiltin commands:\n${BUILTINS['commands']().join("\n")}`,
    commands: getCommands,
    variables () { return this.context.variables }, // Not fat arrow, so `this` can be used
    get: getVariable,
    set: setVariable,
    date: () => new Date(),
    type: v => v instanceof Date ? "date" : (Array.isArray(v) ? "list" : (v === null ? "": typeof v)),
    sleep: n => new Promise(r => setTimeout(r, n * 1000)),
    echo: (...a) => a.flat().filter(isNotNull).map(toString).join(" "),
    cast: (v,t) => {
        if (t === "number") return +v;
        if (t === "string") return toString(v);
        if (t === "list" && typeof v === "string") return v.split("\n");
        return v;
    },
    length: v => (Array.isArray(v) ? v : (typeof v === "string" ? v.split("\n") : [v])).length,
    json: (...a) => a.length === 0 ? null : (a.length === 1 ? JSON.stringify(a[0]) : JSON.stringify(a)),
    range: n => Array(n).fill(0).map((n,i) => i),
    grep: (a, r) => {
        try{
            const re = new RegExp(r);
            return a.filter(v => re.test(v));
        } catch (e) {
            return a.filter(v => v.includes(r));
        }
    },
    index: (a, i) => a[i],
    async tee (value, ...options) {
        const variable = options.find(o => !o.startsWith("-")) || "output";
        const append = options.some(o => o === "-a");
        if (append) {
            const oldVal = await getVariable.call(this, variable) || [];
            const newVal = Array.isArray(oldVal) ? oldVal : [ oldVal ];
            newVal.push(value);
            setVariable.call(this, variable, newVal);
        } else {
            setVariable.call(this, variable, value);
        }
        return value;
    },
    eval (...input) {
        const tokens = tokenise(input.join(" "));
        if (tokens.length === 0) return;
        const statements = parse(tokens);
        return run.call(this, statements[0]);
    }
};

if (typeof alert !== "undefined") {
    BUILTINS['alert'] = (...a) => alert(BUILTINS['echo'](...a));
}

const CONTROL = ["foreach","done"];
const OPERATORS = ["+","-","*","/"];

export default class Shell {
    constructor (context = {}) {
        this.context = context;
    }

    /**
     *
     * @param {string} input
     */
    async execute (input, output=this.output, error=this.error) {
        if (typeof this.context.variables === "undefined") {
            this.context.variables = {};
        }

        this.output = output;
        this.error = error;

        try {
            const tokens = tokenise(input);

            if (tokens.length === 0) return;

            const statements = parse(tokens);

            await this.executeStatements(statements, output, error);
        } catch (e) {
            error(e.message);
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
                const loopVar = statement.args[1] ? await run.call(this, statement.args[1]) : "item";
                this.context.forLoop = {
                    originalItem: variables[loopVar],
                    start: i,
                    items,
                    iteration: 0,
                    loopVar,
                };

                // TODO: this doesn't support nested loops
                const doneIndex = statements.slice(i + 1).findIndex(s => s.control === "done");

                if (doneIndex === -1) {
                    throw Error("Unterminated foreach loop");
                }

                if (items.length === 0) {
                    i = doneIndex;
                    continue;
                }

                variables[loopVar] = items[0];
            }
            else if (statement.control === "done") {
                const { forLoop, variables } = this.context;

                if (forLoop) {
                    forLoop.iteration++;
                    if (forLoop.iteration < forLoop.items.length) {
                        i = forLoop.start;
                        variables[forLoop.loopVar] = forLoop.items[forLoop.iteration];
                    }
                    else {
                        if (typeof forLoop.originalItem === "undefined") {
                            delete variables[forLoop.loopVar];
                        }
                        else {
                            variables[forLoop.loopVar] = forLoop.originalItem;
                        }
                        this.context.forLoop = null;
                    }
                }
                else {
                    throw Error(`Unexpected control word: ${statement.control}`);
                }
            }
            else {
                await this.executeStatementOperator(statement, output, error);
            }
        }
    }

    async executeStatementOperator (statement, output, error) {
        let promise;
        const self = this;
        const originalContext = this.context;
        // capture context
        // bug fix from foreach loop e.g.
        //      range 10 | foreach; sleep $item && echo $item &; done
        const context = { ...originalContext, variables: { ...originalContext.variables } };

        if (statement.operator === "&&") {
            promise = this.executeStatementOperator(statement.left, output, error).then(() => {
                self.context = context;
                return self.executeStatementOperator(statement.right, output, error).then(() => {
                    self.context = originalContext;
                });
            });
        } else {
            promise = this.executeStatement(statement, output, error);
        }

        if (statement.background) {
            promise.catch(e => { throw e; });
        } else {
            await promise;
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
    if (typeof value === "object") return Object.entries(value).map(([n,v]) => `${n} = ${toString(v)}`).join("\n");
    return String(value);
}

async function run (statement) {
    if (typeof statement !== "object") return statement;

    // e.g. $$variable
    if (typeof statement.variable === "object") return getVariable.call(this, await run.call(this, statement.variable));

    if (typeof statement.variable === "string") return getVariable.call(this, statement.variable);

    if (typeof statement.operator === "string") {
        if (statement.operator === "=")
            return setVariable.call(this, statement.name, await run.call(this, statement.value));

        const left = await run.call(this, statement.left);
        const right = await run.call(this, statement.right);

        // eslint-disable-next-line
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
        return BUILTINS[command].call(this, ...evaldArgs);
    }

    return executeCommand.call(this, command, evaldArgs);
};

async function getVariable (name) {
    let { context } = this;

    // Descend through contexts
    // deeper and deeper into each parent until we find variable
    while (context) {
        const { executables = {}, variables = {}, parent } = context;

        if ('get' in executables) {
            try {
                const result = await executables.get(name);
                if (typeof result !== "undefined") return result;
            } catch (e) {}
        }

        if (name in variables) return variables[name];

        context = parent;
    }

    // special cases
    if (name === "commands") return BUILTINS['commands'].call(this);
    if (name === "variables") return [...Object.keys(this.context.variables), "commands", "variables"];
}

async function setVariable (name, value) {
    let { context } = this;

    // Descend through contexts
    // deeper and deeper into each parent until we find variable
    while (context) {
        const { executables = {}, variables = {}, parent } = context;

        if ('set' in executables) {
            try {
                const result = await executables.set(name, value);
                if (result) return value;
            } catch (e) {}
        }

        if (name in variables) {
            try {
                variables[name] = value;
                return value;
            } catch (e) {
                throw Error(`${name} is readonly`);
            }
        }

        context = parent;
    }

    // If we're here we got to the deepest context without finding the variable
    // we're just going to set it on the highest context
    try {
        this.context.variables[name] = value;
        return value;
    } catch (e) {
        throw Error(`${name} is readonly`);
    }
}

async function executeCommand (command, evaldArgs) {
    let { context } = this;

    while (context) {
        const { executables = {} } = context;

        if (command in executables) {
            return executables[command].call(this, ...evaldArgs);
        }

        context = context.parent;
    }

    throw Error(`Command '${command}' not found`);
}

function getCommands () {
    const cmds = new Set(Object.keys(BUILTINS));

    let { context } = this;

    // Descend through contexts
    while (context) {
        const { executables = {} } = context;

        Object.keys(executables).forEach(cmds.add.bind(cmds));

        context = context.parent;
    }

    return Array.from(cmds).sort();
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
            name: "string_verbatim",
            regex: /^'[^']*'/,
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
            regex: /^(;|\${|}|&&|[|=+*/&])/,
        },
        {
            name: "keyword",
            regex: /^(foreach|done)/,
        },
        {
            name: "name",
            regex: /^[\w-]+/,
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
            // Prompt   '> '
            throw Error(`  ${" ".repeat(i)}^\nUnexpected input at ${i}: ${text.substr(i, 10)}`);
        }
    }

    return tokens;
}

/**
 * @typedef StatementNode
 * @prop {string} [control]
 * @prop {string} [command]
 * @prop {StatementNode[]} [args]
 * @prop {string} [operator]
 * @prop {string|StatementNode} [name]
 * @prop {StatementNode} [variable]
 * @prop {string|StatementNode} [value]
 * @prop {string|StatementNode} [left]
 * @prop {string|StatementNode} [right]
 * @prop {boolean} [background]
 */

/**
 *
 * @param {string[]} tokens
 * @returns {StatementNode[]}
 */
function parse (tokens) {
    const statements = splitTokens(tokens, ";").map(parseStatementOperators);

    return statements;
}

/**
 *
 * @param {string[]} tokens
 * @returns {StatementNode}
 */
function parseStatementOperators (tokens) {
    let background = false;

    if (tokens[tokens.length-1] === "&") {
        background = true;
        tokens.length--;
    }

    const statements = splitTokens(tokens, "&&").map(parseStatement);

    const statement = joinStatementOperators(statements);

    statement.background = background;

    return statement;
}

/**
 *
 * @param {*} items
 * @returns {StatementNode}
 */
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

/**
 *
 * @param {string[]} tokens
 * @returns {StatementNode}
 */
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
            /** @type {{ variable: string|{ variable: string }}} */
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
        else if (typeof t === "string" && t[0] === "'") {
            const str = t.substr(1, t.length - 2);

            items.push(str);
        }
        else items.push(t);
    }

    if (items.length === 0) throw Error("Empty pipe segment");

    pipes.push(makeNode(items));

    const statement = joinPipes(pipes);

    return statement;
}

/**
 *
 * @param {StatementNode[]} pipes
 * @returns {StatementNode}
 */
function joinPipes(pipes) {
    return pipes.reduce((prev, curr) => {
        if (prev === null)
            return curr;

        // replace pipe-into-variable scenario with assignment
        if (typeof curr.variable !== "undefined") {
            return {
                operator: "=",
                name: curr.variable,
                value: prev,
            };
        }

        if (!curr.args) {
            throw Error(`Unable to pipe to ${typeof curr}`);
        }

        curr.args.unshift(prev);

        return curr;
    }, null);
}

/**
 *
 * @param {StatementNode[]} statements
 * @returns {StatementNode}
 */
function joinStatementOperators(statements) {
    return statements.reduce((prev, curr) => {
        if (prev === null)
            return curr;

        return {
            operator: "&&",
            left: prev,
            right: curr,
        };
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


function isNull (v) {
    return typeof v === "undefined" || v === null || v === "";
}

function isNotNull (v) {
    return !isNull(v);
}