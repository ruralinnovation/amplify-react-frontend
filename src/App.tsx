import * as React from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Map, { GeolocateControl, NavigationControl, ScaleControl } from "react-map-gl";

import 'mapbox-gl/dist/mapbox-gl.css';

import style from "./App.module.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// const WWB2S_DATA_URL: string = "/examples/who-wins-b2s/rural_places_5000_plus.json";

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

    // const apiContext = useContext(ApiContext);

    return (
        <ThemeProvider theme={theme}>

            <div className={style["slippy-map"]}>
                <Map
                    mapboxAccessToken={MAPBOX_TOKEN}
                    initialViewState={{
                        longitude: -122.4,
                        latitude: 37.8,
                        zoom: 14
                    }}
                    style={{width: 600, height: 400}}
                    mapStyle={`https://api.mapbox.com/styles/v1/mapbox/light-v9?access_token=${MAPBOX_TOKEN}`}
                >
                    {/*<GeocoderControl mapboxAccessToken={MAPBOX_TOKEN} position="top-right" />*/}
                    <GeolocateControl position="top-right" />
                    <NavigationControl position="top-right" />
                    <ScaleControl  position="bottom-left"
                                   unit={"imperial"} />
                </Map>
            </div>

        </ThemeProvider>
    );
}
