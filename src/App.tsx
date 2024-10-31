import * as React from "react";
import {useContext, useEffect, useState} from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { ApiContext} from "@cori-risi/cori.data.api";

import "@cori-risi/cori.data.api/inst/dist/cori.data.api.css";

import "./App.css";
import Dashboard from "./@cori-risi/components/Dashboard";
import Sidebar from "./@cori-risi/components/Sidebar";
import TableauViz from "./@cori-risi/components/TableauViz";

// import style from "./App.module.css";

const theme = createTheme({
    typography: {
        fontFamily: 'Montserrat',
    },
    palette: {
        primary: {
            main: '#00835D',
            light: '#A3E2B5',
            dark: '#26535C',
            contrastText: 'white',
        },
    },
});

function App ({ app_id, attach_content = false, content, content_selector, content_timeout }: { app_id: string, attach_content?: boolean, content: () => HTMLElement, content_selector?: string | null, content_timeout?: number | null }) {

    const apiContext = useContext(ApiContext);
    const [content_loaded, setContentLoaded] = useState(false);

    function addContentToCurrentComponent () {
        if (!!content_timeout && content_timeout !== null) {
            setTimeout(function () {
                if (!content_loaded) {
                    const app_container = document.getElementById(app_id);

                    if (!!app_container) {
                        const app_content: HTMLElement | null = (typeof content === 'function') ?
                            content() :
                            null;

                        if (app_content !== null
                            && app_content.childNodes !== null
                            && app_content.childNodes.length > 0
                        ) {
                            console.log(`Will append content to ${app_id}: `, app_content);
                            setTimeout((container) => {

                                app_content.childNodes.forEach((c: ChildNode) => {
                                    if (c.nodeType === 1) {
                                        const element: HTMLElement = c as HTMLElement;
                                        container.insertAdjacentElement('beforeend', element);
                                    }
                                });

                            }, 53, app_container);

                            setContentLoaded(true);
                        }
                    }
                }
            }, (content_timeout + 1000));
        }
    }

    useEffect( () => {
        if (!!attach_content) {
            addContentToCurrentComponent();
        } else {
            setContentLoaded(true);
        }
    } , []);

    return (
        <ThemeProvider theme={theme}>

            {/*<div style={{position: "absolute", margin: "1em", zIndex: 2}}>*/}
            {/*    <h3>Amplify / React Frontend application template</h3>*/}
            {/*</div>*/}

            {/*<Dashboard />*/}

            {(!!content_loaded && !!content_selector && !!content_timeout) && (
                <TableauViz
                    content={() => {
                        return content();
                    }}
                    content_selector={content_selector}
                    content_timeout={(content_timeout + 1000)} />
            )}

            <Sidebar />

        </ThemeProvider>
    );
}

export default App;

// // TODO: If you want authentication with Amplify Authenticator component...
// export default withAuthenticator(App, {
//     formFields: signInFormFields,
//     components: signInComponents,
//     hideSignUp: true,
//     loginMechanisms: ['username'],
//     socialProviders: ['google']
// });

