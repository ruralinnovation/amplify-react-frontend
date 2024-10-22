import * as React from "react";
import { useContext } from "react";
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

export default function App() {

    // console.log("Re-rendering App component");

    const apiContext = useContext(ApiContext);

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
