import * as React from 'react';
import { createRoot } from 'react-dom/client';

// import { default as sign } from "jwt-encode";
// import * as uuid from "uuid";

import * as tableau from "@tableau/embedding-api";
import { SheetType, TableauEventType } from "@tableau/embedding-api";
import CryptoJS from "crypto-js";

import { ApiContextProvider } from "@cori-risi/cori.data.api";

import App from './App';

import "normalize.css";
import './index.css';


const DATA_API_URL = "https://cori-risi-apps.s3.amazonaws.com";
const reactDomUpdateTimeout = 333;

export function renderToDomWithViz (react_app_id: string, content_selector: string | null) {
    const react_app_container: HTMLElement = document.getElementById(react_app_id) || document.createElement("div");
    const root_content: HTMLElement = document.createElement("div");
    react_app_container.id = react_app_id;

    if (document.getElementById("loader") !== null) {
        document.getElementById("loader")!.remove();
    }

    if (content_selector!==null) {
        // Check for existing viz content before mounting React root component
        for (const elm of react_app_container.childNodes) {
            const innerElm: HTMLElement = elm as HTMLElement;
            if (elm.nodeType === 1) {
                // console.log("Found embedded content:", innerElm);
                root_content.appendChild(innerElm);
            }

            setTimeout(function () {
                if (document.querySelector(content_selector) !== null) {
                    root_content.appendChild(document.querySelector(content_selector) as HTMLElement);
                }
            }, reactDomUpdateTimeout);
        }
    }

    // console.log("Found embedded content:", root_content);

    createRoot(react_app_container).render(<React.StrictMode>
        <ApiContextProvider baseURL={DATA_API_URL}>

            <App app_id={react_app_id}
                 content={() => root_content}
                 content_selector={content_selector}
                 content_timeout={reactDomUpdateTimeout} />

        </ApiContextProvider>
    </React.StrictMode>);

}
