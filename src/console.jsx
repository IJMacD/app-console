import React from 'react';
import Shell from './shell';

import classes from './console.css';

/**
 * @param {object} props
 * @param {Shell} [props.shell]
 * @param {object} [props.context]
 * @param {React.CSSProperties} [props.style]
 * @param {() => void} [props.onClose]
 */
export default function ConsoleDisplay ({ shell = null, context = {}, style = {}, onClose = null }) {
    const [ hist, setHist ] = React.useState([]);
    const [ input, setInput ] = React.useState("");
    const [ scrollback, setScrollback ] = React.useState(0);
    const [ executing, setExecuting ] = React.useState(false);
    /** @type {React.MutableRefObject<HTMLInputElement>} */
    const inputRef = React.useRef();
    const shellRef = React.useRef(shell || new Shell(context));
    /** @type {React.MutableRefObject<HTMLDivElement>} */
    const outerRef = React.useRef();
    const [ textColor, setTextColor ] = React.useState(style.color);
    const [ backgroundColor, setBackgroundColor ] = React.useState(style.backgroundColor);

    React.useEffect(() => {
        context.parent = {
            variables: {
                textColor,
                backgroundColor
            },
            executables: {
                set (name, value) {
                    if (name === "textColor") { setTextColor(value); return true; }
                    if (name === "backgroundColor") { setBackgroundColor(value); return true; }
                    return false;
                },
                exit: onClose || (() => {}),
                clear: () => setHist([]),
            },
        };
    }, [ context, textColor, setTextColor, backgroundColor, setBackgroundColor, onClose, setHist ]);

    React.useEffect(() => {
        inputRef.current && inputRef.current.focus();
        outerRef.current && (outerRef.current.scrollTop = outerRef.current.scrollHeight);
    }, [hist,executing]);

    const handleSubmit = React.useCallback(e => {
        function pushHist (newItem) {
            setHist(hist => [ ...hist, newItem ]);
        }

        async function handleSubmit (e) {
            e.preventDefault();

            setInput("");
            setScrollback(0);
            pushHist({ value: input, type: "input" });

            if (shellRef.current) {
                setExecuting(true);

                await shellRef.current.execute(
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
        }

        handleSubmit(e);
    }, [input, setInput, setScrollback, setHist, setExecuting]);

    /**
     *
     * @param {React.KeyboardEvent<HTMLInputElement>} e
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

    const divStyle = {...style, color: textColor, background: backgroundColor };

    return (
        <div className={classes.ConsoleDisplay} ref={outerRef} onClick={() => getSelection().type !== "Range" && inputRef.current.focus()} style={divStyle}>
            <ul>{ hist.map((l,i) => <li key={i} className={classes[`ConsoleDisplay-hist-${l.type}`]}>{l.value}</li>) }</ul>
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