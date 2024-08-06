import * as React from 'react';
import { useContext, useEffect, useState } from "react";
import * as d3 from 'd3';
import { Layer, DeckProps } from "deck.gl";
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';
import Map, { GeolocateControl, NavigationControl, ScaleControl, useControl } from 'react-map-gl';

import  {ApiContext, ApiContextProvider, coriLightMapStyle } from "@cori-risi/cori.data.api";

import ControlPanel from "./@cori-risi/components/ControlPanel";
import GeocoderControl from "./@cori-risi/components/GeocoderControl";

import 'mapbox-gl/dist/mapbox-gl.css';

const DATA_API_URL = "https://cori-risi-apps.s3.amazonaws.com";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const WWB2S_DATA_URL: string = "/examples/who-wins-b2s/rural_places_2500_plus.json";

type DataType = {
    value: number;
    centroid: [longitude: number, latitude: number];
};

type HexData = {
    lng: number,
    lat: number
};

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

function SlippyMap (props: { dataFilter: { checked: boolean, range: number[] }}) {

    const apiContext = useContext(ApiContext);
    const [ layers, setLayers ] = useState<Layer[]>([
    ]);

    const updatePlaceLayer = (places: PlaceData[], range: number[]) => {
        setLayers([
            new ScatterplotLayer<DataType>({
                id: 'deckgl-circle',
                data: places
                    .filter((d: PlaceData) => d.properties.b2s_flag )
                    .map((d: PlaceData) => {
                        return {
                            value: +d.properties["prop_score_model2_min_pop_rq_2.5K"],
                            centroid: Float32Array.from(d.geometry.coordinates)
                        };
                    }),
                getPosition: d => d.centroid,
                getFillColor: [ 255, 0, 0, 100 ],
                getRadius: 10000,
            }),
            new HexagonLayer<DataType>({
                id: 'deckgl-places-hex',
                data: (() => {
                    return places
                        .map((d: PlaceData) => {
                            return {
                                value: +d.properties["prop_score_model2_min_pop_rq_2.5K"],
                                centroid: Float32Array.from(d.geometry.coordinates)
                            };
                        });
                })(),
                coverage: 1,
                colorRange: [
                    [255, 255, 255],
                    // [209, 55, 78],
                    // [254, 173, 84],
                    // [254, 237, 177],
                    [216, 254, 181],
                    [73, 227, 206],
                    [1, 152, 189]
                ],
                extruded: true,
                elevationRange: [1, 100],
                elevationScale: 2500,
                lowerPercentile: range[0] || 0,
                upperPercentile: range[1] || 100,
                radius: 50000, // Unit or "level" of hexgrid... like "zoom" level in slippy coords
                getColorValue: (data: {
                    /** a list of objects whose positions (lat/lon) fall inside this cell. */
                    objects: DataType[];
                    objectInfo: {
                        /** the indices of `objects` in the original data. */
                        indices: number[];
                        /** the value of the `data` prop */
                        data: DataType;
                    };
                }) => {
                    // console.log("(objects: DataType[]) => ", data);
                    return (d3.max((data as unknown as any[]).map(d => d.value)) || 0.0);
                },
                getElevationValue: (data: {
                    /** a list of objects whose positions (lat/lon) fall inside this cell. */
                    objects: DataType[];
                    objectInfo: {
                        /** the indices of `objects` in the original data. */
                        indices: number[];
                        /** the value of the `data` prop */
                        data: DataType;
                    };
                }) => {
                    // console.log("(objects: DataType[]) => ", data);
                    return (d3.median((data as unknown as any[]).map(d => d.value)) || 0.0);
                },
                getPosition: (d: DataType) => d.centroid,
                pickable: true,
                opacity: 0.25,
            }),
        ]);
    }

    useEffect(() => {

        if (!!apiContext
            && !!apiContext.setData
            // If apiContext.data.placeData is less than 1 or undefined...
            && (apiContext.data?.placeData?.length || 0) < 1
        ) {
            apiContext?.apiClient.get(WWB2S_DATA_URL)
                .then((result) => {

                    if (!!result && result.hasOwnProperty("data")) {

                        console.log("Data result:", result["data"]!["features"]!);

                        const placeData = result["data"]!["features"]!;

                        if (typeof apiContext.setData === "function") {
                            apiContext.setData({
                                ...apiContext.data,
                                placeData
                            });
                        }

                        updatePlaceLayer(
                            placeData
                                .filter((!!props.dataFilter.checked) ?
                                    (d: PlaceData) => d.properties.b2s_flag :   // <= only b2s winners
                                    (d: PlaceData) => !!d                      // <= other places
                                ),
                            props.dataFilter.range
                        );
                    }
                });
        }

    }, [ apiContext ]);

    useEffect(() => {
        if (!!apiContext && !!apiContext.data && apiContext.data.placeData) {
            updatePlaceLayer(apiContext.data
                .placeData
                    .filter((!!props.dataFilter.checked) ?
                        (d: PlaceData) => d.properties.b2s_flag :   // <= only b2s winners
                        (d: PlaceData) => !!d                      // <= allother places
                    ),
                props.dataFilter.range
            );
        }
    }, [ props.dataFilter ]);

    const onMove = (event: any) => {
        // console.log("new map view state:", event["viewState"]);
    }

    return (
        <Map mapboxAccessToken={MAPBOX_TOKEN}
             mapStyle={{...coriLightMapStyle}}
             initialViewState={{
                 latitude: 40,
                 longitude: -100,
                 pitch: 45,
                 zoom: 3.5
             }}
             onMove={onMove}
        >
            {(apiContext !== null) &&
                <DeckGLOverlay layers={layers}/>
            }
            <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN} position="top-left" />
            <GeolocateControl position="top-left" />
            <NavigationControl position="top-left" />
            <ScaleControl  position="bottom-left"
                           unit={"imperial"} />
        </Map>
    );
}

export default function App() {


    const [ placeFilter, setPlaceFilter ] = useState({
        "checked": false,
        "range": [0, 100]
    });

    return (
        <ApiContextProvider baseURL={DATA_API_URL}><>
            <SlippyMap dataFilter={placeFilter} />
            <ControlPanel setFilterState={setPlaceFilter} />
        </></ApiContextProvider>
    );
}
