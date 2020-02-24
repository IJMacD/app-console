import React from 'react';
import { Interpreter } from '.';

import './display.css';

export default function ConsoleDisplay ({ interpreter, context = {}, style={}, onClose=null }) {
    const [ hist, setHist ] = React.useState([]);
    const [ input, setInput ] = React.useState("");
    const [ scrollback, setScrollback ] = React.useState(0);
    const [ executing, setExecuting ] = React.useState(false);
    const inputRef = React.useRef();
    const interpreterRef = React.useRef(interpreter);
    const [ textColor, setTextColor ] = React.useState(style.color);
    const [ backgroundColor, setBackgroundColor ] = React.useState(style.backgroundColor);

    if (!interpreterRef.current) {
        interpreterRef.current = new Interpreter(context);
    }

    React.useEffect(() => {
        context.parent = {
            variables: {
                textColor, 
                backgroundColor
            },
            executables: {
                set (name, value) {
                    if (name === "textColor") return setTextColor(value);
                    if (name === "backgroundColor") return setBackgroundColor(value);
                    throw Error("Unhandled");
                },
                exit: onClose || (() => {}),
            },
        };
    }, [ context, textColor, setTextColor, backgroundColor, setBackgroundColor, onClose ]);

    const handleSubmit = React.useCallback(e => {
        function pushHist (newItem) {
            setHist(hist => [ ...hist, newItem ]);
        }

        async function handleSubmit (e) {
            e.preventDefault();

            setInput("");
            setScrollback(0);
            pushHist({ value: input, type: "input" });
            
            if (interpreterRef.current) {
                setExecuting(true);
                
                await interpreterRef.current.execute(
                    input, 
                    output => {
                        pushHist({ value: output, type: "output" });
                    }, 
                    error => {
                        pushHist({ value: error, type: "error" });
                    }
                );

                setExecuting(false);
            } else {
                pushHist({ value: "No interpreter specified", type: "error" });
            }

            inputRef.current && inputRef.current.focus();
        }

        handleSubmit(e);
    }, [input, setInput, setScrollback, setHist, setExecuting]);

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    function handleKeyUp (e) {
        const inputHist = hist.filter(h => h.type === "input" && h.value);
        let nextScrollback = NaN;

        if (e.key === "ArrowUp") {
            nextScrollback = Math.min(scrollback + 1, inputHist.length);
        }
        else if (e.key === "ArrowDown") {
            nextScrollback = Math.max(scrollback - 1, 0);
        }

        if (!isNaN(nextScrollback)) {
            setScrollback(nextScrollback);

            if (nextScrollback === 0 && scrollback !== 0) {
                setInput("");
            } else if (nextScrollback !== 0) {
                setInput(inputHist[inputHist.length - nextScrollback].value);
            }
        }
    }

    const divStyle = { ...style, color: textColor, background: backgroundColor };

    return (
        <div className="ConsoleDisplay" onClick={() => getSelection().type !== "Range" && inputRef.current.focus()} style={divStyle}>
            <ul>{ hist.map((l,i) => <li key={i} className={`ConsoleDisplay-hist-${l.type}`}>{l.value}</li>) }</ul>
            <form onSubmit={handleSubmit}>
                { !executing && '> ' }
                <input 
                    value={input} 
                    ref={inputRef}
                    disabled={executing}
                    onChange={e => setInput(e.target.value)} 
                    onKeyUp={handleKeyUp} 
                    // prevent cursor from jumping to beginning of line
                    onKeyDown={e => e.key === "ArrowUp" && e.preventDefault()}
                    autoFocus
                />
            </form>
        </div>
    );
}