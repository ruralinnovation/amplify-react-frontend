import * as React from "react";

import {
    // ApiContext,
    coriLightMapStyle,
    GeocoderControl
} from "@cori-risi/cori.data.api";

import Map, {
    GeolocateControl,
    NavigationControl,
    ScaleControl
} from "react-map-gl";


import style from "./App.module.css";

import "@cori-risi/cori.data.api/inst/dist/cori.data.api.css";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function App() {

    // console.log("Re-rendering App component");

    return (<>
        <div className={style["slippy-map"]}>
            <Map
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle={{...coriLightMapStyle}}
              initialViewState={{
                latitude: 39,
                longitude: -97.5,
                pitch: 45,
                zoom: 4.15
              }}
              onMove={(event: any) => {
                // console.log("new map view state:", event["viewState"]);
              }}
            >

                <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN} position="top-right" />
                <GeolocateControl position="top-right" />
                <NavigationControl position="top-right" />

                <ScaleControl  position="bottom-left"
                               unit={"imperial"} />

            </Map>
        </div>
        {/*<ControlPanel/>*/}
    </>);
}

