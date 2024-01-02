import React, {ReactElement} from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { Amplify } from "aws-amplify";
import { AuthConfig } from "@aws-amplify/core";
import { getCurrentUser } from "@aws-amplify/auth/cognito";
import PropTypes from "prop-types";

// import aws_config from "./aws-config";
// import aws_config from '@/amplifyconfiguration.json';
import aws_config from '../amplifyconfiguration.json';

import { User } from "./@cori-risi/models";
import App from './@cori-risi/frontend/App.tsx';
import store from "./@cori-risi/frontend/app/store";

Amplify.configure(aws_config);

const auth: AuthConfig = Amplify.getConfig().Auth!; //?.Cognito;

function OfflineNotification (props: { children?: ReactElement }) {
    console.log(`VITE_OFFLINE_NOTIFICATION: ${import.meta.env.VITE_OFFLINE_NOTIFICATION}`)
    if (import.meta.env.VITE_OFFLINE_NOTIFICATION !== "false") {
        return <div className="offline-notification"
                    dangerouslySetInnerHTML={{
                        __html: import.meta.env.VITE_OFFLINE_NOTIFICATION
                    }}
                    style={{height: "calc(100vh - 290px)", padding: "25%"}} />
    } else return props.children;
}

OfflineNotification.propTypes = { children: PropTypes.node };

/**TODO:
 * To enable the following React header component, go into the index.html file and change the id
 * of the first div to "react-header" and comment out the cori.apps "src/bundle.js" script tag
 * that is just before the "src/main.tsx" script tag near the closing body tag.
 */
const initHeader = (evt: Event) => {
    const header_id = 'react-header';
    const header: HTMLElement | null = document.getElementById(header_id);
    
    if (header !== null && header.constructor.name === "HTMLDivElement") {
        ReactDOM.createRoot(header)
            .render(
                <React.StrictMode>
                    <header style={{ position: "fixed", top: 0, left: 0, maxWidth: "100%", width: "100vw", maxHeight: "108px", height: "75px", zIndex: 1 }}>
                        <nav>
                            <div>
                                <div style={{ display: "inline-block" }}>
                                    <a href="/"><h2>{header.title}</h2></a>
                                </div>
                                <div title="Search" style={{ display: "inline-block", float: "right" }}>
                                    <div role="combobox" aria-expanded="false" aria-haspopup="listbox">
                                        <button type="button">
                                            <div style={{ display: "inline-block" }}><label>Search</label></div>
                                            <div style={{ display: "inline-block" }}>
                                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"></path></svg>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </header>
                </React.StrictMode>
            );
    }
}

const initMain = (evt: Event) => {
    const react_app_id: string = 'react-app';
    const react_app_container: HTMLElement = document.getElementById(react_app_id) || document.createElement("div");
    react_app_container.id = 'react-app';
    const root_content: HTMLElement = document.createElement("div");
    const user: Promise<User> = getCurrentUser();
    
    console.log("AWS Auth config: ", auth);

    console.log("AWS Cognito config:", auth?.Cognito);
    
    console.log(evt);
    
    initHeader(evt);
    
    for (const elm of react_app_container.childNodes) {
        const innerElm = elm;
        if (elm.nodeType === 1) {
            root_content.appendChild(innerElm);
        }
    }

    const root = ReactDOM.createRoot(react_app_container!);
    root.render(
        <React.StrictMode>
            <OfflineNotification>
                <Provider store={store}>
                    {/*<Router>*/}
                    {/*    <ApiContextProvider aws_config={aws_config}>*/}
                    {/*        <App />*/}
                            <App content={() => root_content} user={user} />
                    {/*    </ApiContextProvider>*/}
                    {/*</Router>*/}
                </Provider>
            </OfflineNotification>
        </React.StrictMode>
    );

    react_app_container.style.opacity = "1.0";
};

const init_event = new Event("Initialize frontend app!");

initMain(init_event);
