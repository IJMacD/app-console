import React from 'react';

import './display.css';

export default function ConsoleDisplay ({ interpreter }) {
    const [ hist, setHist ] = React.useState([]);
    const [ input, setInput ] = React.useState("");
    const [ scrollback, setScrollback ] = React.useState(0);
    const [ executing, setExecuting ] = React.useState(false);
    const inputRef = React.useRef();

    async function handleSubmit (e) {
        e.preventDefault();

        setInput("");
        setScrollback(0);
        setHist(hist => [ ...hist, { value: input, type: "input" } ]);
        setExecuting(true);
        
        await interpreter.execute(
            input, 
            output => {
                setHist(hist => [ ...hist, { value: output, type: "output" } ]);
            }, 
            error => {
                setHist(hist => [ ...hist, { value: error, type: "error" } ]);
            }
        );

        setExecuting(false);
        inputRef.current.focus();
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    function handleKeyUp (e) {
        const inputHist = hist.filter(h => h.type === "input");
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

    return (
        <div className="ConsoleDisplay" onClick={() => getSelection().type !== "Range" && inputRef.current.focus()}>
            <ul>{ hist.map((l,i) => <li key={i} className={`ConsoleDisplay-hist-${l.type}`}>{l.value}</li>) }</ul>
            <form onSubmit={handleSubmit}>
                { !executing && '> '}
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