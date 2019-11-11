import * as React from "react";
import {init_instr, with_instr} from "./adapter";
import {Master} from "./Master";
import {Noise} from "./Noise";
import {Oscillator} from "./Oscillator";
import {Piano} from "./Piano";
import {INITIAL_STATE, reducer} from "./state";

export function App() {
    let [audio] = React.useState(new AudioContext());
    let [state, dispatch] = React.useReducer(with_instr(reducer), INITIAL_STATE, init_instr);
    return (
        <>
            <h1>Have Fun Audio Editor</h1>
            <div className="row">
                <div className="group">
                    <h2>Options</h2>
                    <div>
                        <button onClick={e => console.log(JSON.stringify(state.instrument))}>
                            Export instrument
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                let instr = JSON.parse(prompt("Pase JSON:")!);
                                dispatch({kind: "IMPORT_INSTR", instr});
                            }}
                        >
                            Import instrument
                        </button>
                    </div>
                    <p>
                        <em>See console.</em>
                    </p>
                </div>
                <Master
                    change={evt =>
                        dispatch({
                            kind: "CHANGE_MASTER",
                            target: evt.target as HTMLInputElement,
                        })
                    }
                    instr={state}
                />
                {state.sources.map((source, index) => {
                    switch (source.kind) {
                        case "noise":
                            return (
                                <Noise
                                    key={index}
                                    change={evt =>
                                        dispatch({
                                            kind: "CHANGE_SOURCE",
                                            target: evt.target as HTMLInputElement,
                                            index,
                                        })
                                    }
                                    source={source}
                                />
                            );
                        case "oscillator":
                            return (
                                <Oscillator
                                    key={index}
                                    change={evt =>
                                        dispatch({
                                            kind: "CHANGE_SOURCE",
                                            target: evt.target as HTMLInputElement,
                                            index,
                                        })
                                    }
                                    source={source}
                                />
                            );
                    }
                })}
            </div>
            {state.instrument && (
                <div className="row">
                    <Piano audio={audio} instr={state.instrument} />
                </div>
            )}
        </>
    );
}
