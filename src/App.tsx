import * as React from "react";
import { useContext, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { ApiContext} from "@cori-risi/cori.data.api";

import "@cori-risi/cori.data.api/inst/dist/cori.data.api.css";

import "./App.css";
import Dashboard from "./@cori-risi/components/Dashboard";
import Sidebar from "./@cori-risi/components/Sidebar";
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

function App ({ app_id, content, timeout }: { app_id: string, content: () => HTMLElement, timeout: number }) {

    // console.log("Re-rendering App component");

    const apiContext = useContext(ApiContext);

    let content_loaded = false;

    function addContentToCurrentComponent () {
        setTimeout(function () {
        if (!content_loaded) {
            // Anything in here is fired on component mount.
            const app_container = document.getElementById(app_id) ;
            if (!!app_container) {
                const app_content = (typeof content === 'function') ?
                    content() :
                    { childNodes: [] };
                setTimeout((container) => {
                    // console.log("Will append content: ", app_content);
                    // container.append(app_content.childNodes);
                    app_content.childNodes.forEach((c: ChildNode) => {
                        if (c.nodeType === 1) {
                            const element: HTMLElement = c as HTMLElement;
                            container.insertAdjacentElement('beforeend', element);
                        }
                    });
                }, 53, app_container);
                content_loaded = true;
            }
        }
        }, (timeout + 1000));
    }

    useEffect( addContentToCurrentComponent , []);

    return (
        <ThemeProvider theme={theme}>

            {/*<div style={{position: "absolute", margin: "1em", zIndex: 2}}>*/}
            {/*    <h3>Amplify / React Frontend application template</h3>*/}
            {/*</div>*/}

            {/*<Dashboard />*/}

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

