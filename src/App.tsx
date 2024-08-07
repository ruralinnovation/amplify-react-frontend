import * as React from 'react';

import { ApiContextProvider } from "@cori-risi/cori.data.api";

import "@cori-risi/cori.data.api/inst/dist/cori.data.api.css";

const DATA_API_URL = "https://cori-risi-apps.s3.amazonaws.com";

export default function App() {

    return (
        <ApiContextProvider baseURL={DATA_API_URL}>
            <div style={{position: "absolute", zIndex: 2}}>
                <h3>Amplify / React Frontend application template</h3>
            </div>
        </ApiContextProvider>
    );
}
