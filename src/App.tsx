import * as React from "react";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

import * as mapbox from 'mapbox-gl';
import Map, { Marker, GeolocateControl, NavigationControl, ScaleControl } from "react-map-gl";

import { ApiContext, GeocoderControl } from "@cori-risi/cori.data.api";

import 'mapbox-gl/dist/mapbox-gl.css';

import "@cori-risi/cori.data.api/inst/dist/cori.data.api.css";

import "./App.css";
// import style from "./App.module.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const DATA_URL: string = "/examples/cori.data.rin/rin_service_areas.geojson";

interface Place {
    type: string;
    properties: {
        [key: string]: string | number | boolean;
    };
    geometry: { type: string; coordinates: number[]; };
}

// const theme = createTheme({
//     typography: {
//         fontFamily: 'Montserrat',
//     },
//     palette: {
//         primary: {
//             main: '#00835D',
//             light: '#A3E2B5',
//             dark: '#26535C',
//             contrastText: 'white',
//         },
//     },
// });

export default function App() {

    // console.log("Re-rendering App component");

    const apiContext = useContext(ApiContext);

    const markerRef = useRef<mapbox.Marker | null>(null);

    const popup = useMemo(() => {
        return (longitued: number, latitude: number, key: string, properties: any) => {
            console.log("Set popup: ", markerRef.current);
            const marker = (new mapbox.Popup());
            if (properties.hasOwnProperty(key)) {
                marker.setLngLat([longitued, latitude]);
                marker.setText(properties[key]);
            } else {
                marker.setText('Hello world!');
            }
            return marker;
        };
    }, []);

    const togglePopup = (event: any) => {
        console.log("Toggle popup: ", event);
        markerRef.current?.togglePopup();
    };

    let fetchingPlaceData = false;

    function placeMarkers(ref: typeof markerRef, longitued: number, latitude: number, color: string, popup: any, key: string, properties: any) {
        return (
            <Marker ref={ref} longitude={longitued} latitude={latitude} color={color} popup={popup(longitued, latitude, key, properties)} key={properties[key] + "-marker"} />
        );
    }

    useEffect(() => {

        if (!!apiContext
            // If apiContext.data.placeData is undefined...
            && !apiContext.data.hasOwnProperty("placeData")
            && !fetchingPlaceData
        ) {

            console.log("Initial place data fetch...");
            // console.log(DATA_URL.replace(/rural_places(?:_[\d]+_plus)/, placeModel));
            console.log(DATA_URL);

            // ... ensures "placeData" is fetched only once (see console)
            fetchingPlaceData = true;

            const infoWrapper = window.document.getElementById("info-wrapper");
            if (infoWrapper !== null) {
                infoWrapper
                    .style.opacity = "1.0";
                infoWrapper
                    .style.position = "absolute";
                infoWrapper
                    .style.background = `rgba(46, 60, 67, 0.5) url('${apiContext.baseURL}/images/loading.gif') no-repeat fixed center`;
                infoWrapper
                    .style.backgroundSize = "20px";
            }

            apiContext.setData({
                ...(apiContext?.data || {}),
                placeData: null
            });


            apiContext?.apiClient.get(DATA_URL)
                .then((result) => {

                    if (!!result && result.hasOwnProperty("data")) {

                        console.log("Data result:", result["data"]!["features"]!);

                        apiContext.setData({
                            ...apiContext.data,
                            placeData: (result["data"]!["features"]!) as Place[]
                        });

                        fetchingPlaceData = false;

                        if (infoWrapper !== null) {
                            infoWrapper
                                .style.opacity = "0.0";
                            infoWrapper
                                .style.pointerEvents = "none";
                            setTimeout(() => {
                                infoWrapper
                                    .style.background = "transparent";
                            }, 533);
                        }
                    }
                })
                .catch(error => {

                    console.error("Error fetching data:", error);

                    fetchingPlaceData = false;

                    if (infoWrapper !== null) {
                        infoWrapper
                            .style.opacity = "0.0";
                        infoWrapper
                            .style.pointerEvents = "none";
                        setTimeout(() => {
                            infoWrapper
                                .style.background = "transparent";
                        }, 533);
                    }

                });
        }

    }, [ apiContext?.data ]);

    return (
        // <ThemeProvider theme={theme}>
        <>
            <div style={{position: "absolute", margin: "1em", zIndex: 2}}>
                <h3>Amplify / React Frontend application template</h3>
            </div>

            <div className={"slippy-map"}>
                <Map
                    mapboxAccessToken={MAPBOX_TOKEN}
                    initialViewState={{
                        latitude: 40,
                        longitude: -100,
                        pitch: 45,
                        zoom: 3.5
                    }}
                    style={{width: 600, height: 400}}
                    // mapStyle={`https://api.mapbox.com/styles/v1/mapbox/light-v9?access_token=${MAPBOX_TOKEN}`}
                    mapStyle={`https://api.mapbox.com/styles/v1/ruralinno/cl010e7b7001p15pe3l0306hv?access_token=${MAPBOX_TOKEN}`}
                >
                    {(!!apiContext?.data && !!apiContext?.data?.placeData  && apiContext.data.placeData.length > 0)
                        && (
                            !!markerRef && typeof markerRef !== undefined
                            // && <Marker longitude={-122.4} latitude={37.8} color="red" popup={popup} ref={markerRef} />
                            && apiContext.data.placeData.map((p: Place) => {
                                console.log(p);
                                const longitude = (typeof p.geometry.coordinates[0] == "number")?
                                    p.geometry.coordinates[0] : 0;
                                const latitude = (typeof p.geometry.coordinates[1] == "number")?
                                    p.geometry.coordinates[1] : 0;
                                return placeMarkers(markerRef, longitude, latitude, "#247dc9", popup, "rin_community", p.properties);
                            })
                            // {
                            //   "rin_community": "Pine Bluff",
                            //   "state_abbr": "AR",
                            //   "primary_county_name": "Jefferson",
                            //   "geoid_co": "05069",
                            //   "Service Area": "The City of Pine Bluff",
                            //   "places_served": "Pine Bluff, AR",
                            //   "geoid_primary_place": null,
                            //   "rin_year": 2019,
                            //   "rii_year": 2019,
                            //   "Type": "RNTA",
                            //   "Status": "Active",
                            //   "STATEFP": "05",
                            //   "COUNTYFP": "069",
                            //   "COUNTYNS": "00066862",
                            //   "AFFGEOID": "0500000US05069",
                            //   "NAME": "Jefferson",
                            //   "NAMELSAD": "Jefferson County",
                            //   "STUSPS": "AR",
                            //   "STATE_NAME": "Arkansas",
                            //   "LSAD": "06",
                            //   "ALAND": 2259419628,
                            //   "AWATER": 113071689
                            // }
                        )
                    }

                    <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN} position="top-right" />
                    <GeolocateControl position="top-right" />
                    <NavigationControl position="top-right" />
                    <ScaleControl  position="bottom-left"
                                   unit={"imperial"} />
                </Map>
            </div>

            <div id="info-wrapper" style={{
                pointerEvents: "none",
                position: "absolute",
                top: 0,
                minWidth: "100vw",
                minHeight: "100vh",
                transition: "opacity 5.05s ease-in-out 0.025s",
                opacity: "initial",
                background: "transparent",
                backgroundSize: "20px",
                zIndex: 100
            }} />
        </>
        // </ThemeProvider>
    );
}
