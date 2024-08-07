import * as React from 'react';
import { useContext, useEffect, useState } from "react";
import { Layer, DeckProps } from "deck.gl";
import { ScatterplotLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';
import Map, { GeolocateControl, NavigationControl, ScaleControl, useControl } from 'react-map-gl';

import { ApiContext, ApiContextProvider, coriLightMapStyle, GeocoderControl, HoverInfo, HoverObject } from "@cori-risi/cori.data.api";

import 'mapbox-gl/dist/mapbox-gl.css';

const DATA_API_URL = "https://cori-risi-apps.s3.amazonaws.com";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const WWB2S_DATA_URL: string = "/examples/who-wins-b2s/rural_places_2500_plus.json";

type PlaceData = {
    type: string;
    properties: {
        [key: string]: string | number | boolean;
    };
    geometry: { type: string; coordinates: number[]; };
};

function DeckGLOverlay (props: DeckProps) {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
}

function SlippyMap () {

    const apiContext = useContext(ApiContext);

    const [ layers, setLayers ] = useState<Layer[]>([]);

    let fetchingPlaceData = false;

    useEffect(() => {

        if (!!apiContext
            // If apiContext.data.placeData is undefined...
            && !apiContext.data.hasOwnProperty("placeData")
            && !fetchingPlaceData
        ) {

            apiContext.setData({
                ...apiContext.data,
                placeData: null
            });

            // ... ensures "placeData" is fetched only once (see console)
            fetchingPlaceData = true;

            apiContext?.apiClient.get(WWB2S_DATA_URL)
                .then((result) => {

                    if (!!result && result.hasOwnProperty("data")) {

                        const placeData = result["data"]!["features"]!;

                        apiContext.setData({
                            ...apiContext.data,
                            placeData
                        });

                        fetchingPlaceData = false;
                    }
                });
        }

    }, [ apiContext?.apiClient ]);

    useEffect(() => {
        if (!!apiContext
            // If apiContext.data.placeData is undefined...
            && apiContext.data.hasOwnProperty("placeData")
            && apiContext.data.placeData.length > 0
        ) {
            setLayers([
                new ScatterplotLayer<PlaceData>({
                    id: 'deckgl-circle',
                    data: apiContext.data.placeData
                        .filter((d: PlaceData) => d.properties.b2s_flag),
                    getPosition: d => Float32Array.from(d.geometry.coordinates),
                    getFillColor: [255, 0, 0, 100],
                    getRadius: 10000,
                })
            ]);
        }
    }, [ apiContext?.data ]);

    return (
        <Map mapboxAccessToken={MAPBOX_TOKEN}
             mapStyle={{...coriLightMapStyle}}
             initialViewState={{
                 latitude: 40,
                 longitude: -100,
                 pitch: 45,
                 zoom: 3.5
             }}
             // onMove={(event: any) => {
             //     console.log("Map view state:", event["viewState"]);
             // }}
        >
            {(apiContext !== null) &&
                <DeckGLOverlay layers={layers}/>
            }
            {/*<GeocoderControl mapboxAccessToken={MAPBOX_TOKEN} position="top-right" />*/}
            {/*<GeolocateControl position="top-right" />*/}
            {/*<NavigationControl position="top-right" />*/}
            {/*<ScaleControl  position="bottom-right" unit={"imperial"} />*/}
        </Map>
    );
}

export default function App() {

    // const [ hoverInfo, setHoverInfo ] = useState<HoverObject | null>(null);

    return (
        <ApiContextProvider baseURL={DATA_API_URL}>
            <div style={{position: "absolute", zIndex: 2}}>
                <h3>Frontend UI (React) template</h3>
                <h4>Previous Build-To-Scale Winners</h4>
            </div>
            <SlippyMap />
            {/*<ControlPanel />*/}
            {/*{(hoverInfo !== null) ?*/}
            {/*    <HoverInfo hoverInfo={hoverInfo}>*/}
            {/*        <div style={{pointerEvents: "none"}}>*/}
            {/*            <h3>{ hoverInfo.name }</h3>*/}
            {/*            <p>...</p>*/}
            {/*        </div>*/}
            {/*    </HoverInfo> :*/}
            {/*    <></>*/}
            {/*}*/}
        </ApiContextProvider>
    );
}
