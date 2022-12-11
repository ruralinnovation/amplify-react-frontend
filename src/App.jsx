import {Component, useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import AbstractingContainersAndItems from "./components/material-ui/AbstractingContainersAndItems";
import FillingSpace from "./components/material-ui/FillingSpace";
import UnderstandingBreakpoints from "./components/material-ui/UnderstandingBreakpoints";

import axios from 'axios';
import { debounce } from 'lodash';
import Plot from 'react-plotly.js';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// import aws_config from "./aws-config";

class Header extends Component {
    render() {
        return (
            <div>
                <header className="App-header">
                    <h1 className="App-title">React / Shiny / Plumber Frontend</h1>

                    <div>
                        <a href="https://vitejs.dev" target="_blank">
                            <img src="/vite.svg" className="logo" alt="Vite logo" />
                        </a>
                        <a href="https://reactjs.org" target="_blank">
                            <img src={reactLogo} className="logo react" alt="React logo" />
                        </a>
                    </div>

                    <h1>Vite + React</h1>
                    <p className="read-the-docs">
                        Click on the Vite and React logos to learn more
                    </p>
                </header>
            </div>
        )
    }
}

function App ({ content }) {
    const [count, setCount] = useState(0);
    let content_loaded = false;
    const [state, setState] = useState({
        rawdata: [
            {
                y: null,
                x: null,
                type: 'bar'
            }
        ]
    });

    const [windowWidth, setWidth]   = useState(0);
    const [windowHeight, setHeight] = useState(0);
    const [windowRatio, setRatio] = useState(0);
    const updateDimensions = () => {
        if (!!window &&
            window.hasOwnProperty("innerWidth") &&
            window.hasOwnProperty("innerHeight")
        ) {
            console.log("Update width to: " + window.innerWidth)
            setWidth(window.innerWidth);
            console.log("Update height to: " + window.innerHeight)
            setHeight(window.innerHeight);
            console.log("Update height/width ratio to: " + window.innerHeight/window.innerWidth);
            setRatio(window.innerHeight/window.innerWidth);
        }
    }
    useEffect(() => {
        window.addEventListener("load", updateDimensions);
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    function addContentToCurrentComponent () {
        // console.log("Welcome to Amplify React app version:", import.meta.env.VITE_APP_VERSION)
        // console.log(aws_config);

        if (!content_loaded) {
            // Anything in here is fired on component mount.
            const app_container = document.getElementsByClassName("App")[0];
            const app_first_child = app_container.childNodes[0] || null;
            const app_content = (typeof content === 'function') ?
                content() :
                { childNodes: [] };
            console.log(app_first_child);
            console.log(app_content.childNodes);
            setTimeout((container) => {
                // container.append(app_content.childNodes);
                app_content.childNodes.forEach(c => {
                    console.log(c);
                    container.insertBefore(c, app_first_child)
                });
            }, 53, app_container);
            content_loaded = true;
        }
    }
    useEffect( addContentToCurrentComponent , []);

    async function onSliderChange(input) {
        console.log("what?");

        return axios.get(`${import.meta.env.VITE_API_BACKEND}/__api__/hist-raw`,
            {
                params: {
                    bins: input,
                }
            }
        )
            .then((data) => {
                console.log(data.data);

                console.log("Render to plotly component:\n" +
"<Plot\n" +
"    data={" + state.rawdata + "}\n" +
"    layout={{\n" +
"        title: 'Histogram of waiting times',\n" +
"        bargap: 0.01,\n" +
"        autosize: false,\n" +
"        width: (0.364583 * " + windowWidth + "),\n" +
"        height: (0.234375 * " + windowWidth + "),\n" +
"        xaxis: {\n" +
"            title: 'Waiting time to next eruption (in mins)'\n" +
"        },\n" +
"        yaxis: {\n" +
"            title: 'Frequency'\n" +
"        },\n" +
"        useResizeHandler: true,\n" +
"        responsive: true\n" +
"    }}\n" +
"/>"
                )

                setState({
                    rawdata: [
                        {
                            y: data.data.map(x => x["counts"]),
                            x: data.data.map(x => x["mids"]),
                            type: 'bar'
                        }
                    ]
                })
            });
    }

    return (
        <div className="App">
            <Header />

            <div className="card">
                <Plot
                    data={state.rawdata}
                    layout={{
                        title: 'Histogram of waiting times',
                        bargap: 0.01,
                        autosize: false,
                        width: (0.364583 * windowWidth), // + "px",
                        height: (0.234375 * windowWidth), // + "px", // (yes, width)
                        xaxis: {
                            title: 'Waiting time to next eruption (in mins)'
                        },
                        yaxis: {
                            title: 'Frequency'
                        },
                        useResizeHandler: true,
                        responsive: true
                    }}
                />
                <Slider
                    id={"bins"}
                    onChange={debounce(onSliderChange, 60)}
                    min={1}
                    max={50}
                    marks={{
                        1: '1',
                        13: '13',
                        26: '26',
                        38: '38',
                        50: '50'
                    }} toolTipVisibleAlways={true} />
                <br />
                <label htmlFor="bins" className="col-form-label">
                    Number of bins
                </label>

            </div><br />

            {/*<div className="card">*/}
            {/*    <button onClick={() => setCount((count) => count + 1)}>*/}
            {/*        count is {count}*/}
            {/*    </button>*/}
            {/*</div>*/}

            {/*<AbstractingContainersAndItems />*/}

            {/*<FillingSpace />*/}

            {/*<UnderstandingBreakpoints />*/}

        </div>
    )
}

export default App
