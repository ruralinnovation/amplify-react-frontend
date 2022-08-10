import aws_exports from "./aws-exports";

import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// import Amplify from '@aws-amplify/core/lib-esm';
// import { API, graphqlOperation } from '@aws-amplify/api/lib-esm';
// const aws_amplify = require('@aws-amplify/core/src');
const Amplify = aws_amplify.default;
const API = aws_amplify.API;
const graphqlOperation = aws_amplify.graphqlOperation;

Amplify.configure(aws_exports);

const root_id = 'app';
const root_container = document.getElementById(root_id);
const root_content = document.createElement("div");
const root_init = (evt) => {
    // console.log(evt);
    // evt.preventDefault();
    // console.log(root_container.childNodes.length, root_container.childNodes);

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
    )
};

if (typeof shinyjs === 'object') {
    document.body.addEventListener('cori.apps:render', root_init);
} else {
    root_init({ preventDefault: () => {} })
}
