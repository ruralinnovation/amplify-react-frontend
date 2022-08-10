import {Component, useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import UnderstandingBreakpoints from "./components/material-ui/UnderstandingBreakpoints";
import FillingSpace from "./components/material-ui/FillingSpace";
import AbstractingContainersAndItems from "./components/material-ui/AbstractingContainersAndItems";

import aws_config from "./aws-config";
import * as aws_amplify_core from "@aws-amplify/core";
import * as aws_amplify_react from "aws-amplify-react";
const Amplify = aws_amplify_core.Amplify;

Amplify.configure(aws_config);

window['Amplify'] = Amplify;
window['Auth'] = aws_amplify_core.Auth;
window['aws_amplify_react'] = aws_amplify_react;

const Authenticator = aws_amplify_react.Authenticator;

class Header extends Component {
    render() {
        return (
            <div>
                <header className="App-header">
                    <h1 className="App-title">Amplify React</h1>
                </header>
                {/*<AmplifySignOut />*/}
            </div>
        )
    }
}

function App ({ content }) {
  const [count, setCount] = useState(0);
  let content_loaded = false;

  function addContentToCurrentComponent () {
      console.log("Welcome to Amplify React app version:", import.meta.env.VITE_APP_VERSION)

      console.log("Amplify config:", aws_config);

      console.log("AWS Amplify React:", aws_amplify_react);

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

  return (
    <div className="App">
        <Authenticator>
            <>
            <Header />
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src="/vite.svg" className="logo" alt="Vite logo" />
                </a>
                <a href="https://reactjs.org" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            {/*<AbstractingContainersAndItems />*/}
            {/*<FillingSpace />*/}
            {/*<UnderstandingBreakpoints />*/}
            {/*<div className="card">*/}
            {/*  <button onClick={() => setCount((count) => count + 1)}>*/}
            {/*    count is {count}*/}
            {/*  </button>*/}
            {/*</div>*/}
            {/*<p className="read-the-docs">*/}
            {/*  Click on the Vite and React logos to learn more*/}
            {/*</p>*/}
            </>
        </Authenticator>
    </div>
  )
}

export default App
