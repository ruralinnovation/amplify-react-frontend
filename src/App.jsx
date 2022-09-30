import {Component, useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import AbstractingContainersAndItems from "./components/material-ui/AbstractingContainersAndItems";
import FillingSpace from "./components/material-ui/FillingSpace";
import UnderstandingBreakpoints from "./components/material-ui/UnderstandingBreakpoints";

// import aws_config from "./aws-config";

class Header extends Component {
    render() {
        return (
            <div>
                <header className="App-header">
                    <h1 className="App-title">Amplify React</h1>
                </header>
            </div>
        )
    }
}

function App ({ content }) {
  const [count, setCount] = useState(0);
  let content_loaded = false;

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

  return (
    <div className="App">
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
        <p className="read-the-docs">
            Click on the Vite and React logos to learn more
        </p>
        <AbstractingContainersAndItems />
        <FillingSpace />
        <UnderstandingBreakpoints />
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
    </div>
  )
}

export default App
