import './index.css';

import React from 'react';
import { ReactDOM, createRoot } from 'react-dom/client';
import App from './App';

import aws_config from "./aws-config";
import * as aws_amplify_core from "@aws-amplify/core";

aws_amplify_core.Amplify.configure(aws_config);

const root_id = 'app';
const root_container = document.getElementById(root_id);
const root_content = document.createElement("div");
const root_init = (evt) => {
    // console.log(evt);
    // evt.preventDefault();
    // console.log(root_container.childNodes.length, root_container.childNodes);

    console.log("Amplify config:", aws_config);

    for (const elm of root_container.childNodes) {
        const innerElm = elm;
        if (elm.nodeType === 1) {
            console.log(elm.nodeType, elm);
            root_content.appendChild(innerElm);
        } else if (elm.nodeType === 3) {
            console.log(elm.nodeType, elm);
        }
    }

    const root = createRoot(root_container);
    root.render(
        <React.StrictMode>
            <App content={ () => root_content } />
        </React.StrictMode>
    );
};

if (typeof shinyjs === 'object') {
    document.body.addEventListener('cori.apps:render', root_init);
} else {
    root_init({ preventDefault: () => {} })
}
