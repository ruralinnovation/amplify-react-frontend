import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from "aws-amplify";
import App from './@cori-risi/frontend/App.tsx';
// import configureStore from "./@cori-risi/frontend/configureStore";
import PropTypes from "prop-types";

// import aws_config from "./aws-config";
// import aws_config from '@/amplifyconfiguration.json';
import aws_config from '../amplifyconfiguration.json';

Amplify.configure(aws_config);

const root_id: string = 'react-app';
const root_container: HTMLElement = document.getElementById(root_id) || document.createElement("div");
root_container.id = 'react-app';
const root_content: HTMLElement = document.createElement("div");
// const store = configureStore();

function OfflineNotification (props: HTMLElement) {
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

const root_init = (evt: Event) => {
    console.log(evt);

    for (const elm of root_container.childNodes) {
        const innerElm = elm;
        if (elm.nodeType === 1) {
            root_content.appendChild(innerElm);
        }
    }

    const root = ReactDOM.createRoot(root_container!);
    // root.render(
    //     <React.StrictMode>
    //         <App content={ () => root_content } />
    //     </React.StrictMode>
    // );
    root.render(
        <React.StrictMode>
            {/*<OfflineNotification>*/}
            {/*    <ReduxProvider store={store}>*/}
            {/*        <Router>*/}
            {/*            <ApiContextProvider aws_config={aws_config}>*/}
                            <App content={() => root_content} />
            {/*                <App />*/}
            {/*            </ApiContextProvider>*/}
            {/*        </Router>*/}
            {/*    </ReduxProvider>*/}
            {/*</OfflineNotification>*/}
        </React.StrictMode>
    );

    root_container.style.opacity = "1.0";
};

const init_event = new Event("init");

root_init(init_event);
