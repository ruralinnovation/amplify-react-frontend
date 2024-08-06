import * as React from 'react';
import { useContext, useEffect, useState } from "react";
import * as d3 from 'd3';
import {Layer, DeckProps, ColumnLayer} from "deck.gl";
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

const UBER_DATA_URL: string = "/examples/3d-heatmap/heatmap-data.csv";
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

function SlippyMap () {

    const apiContext = useContext(ApiContext);
    const [ layers, setLayers ] = useState<Layer[]>([
        new HexagonLayer<HexData>({
            id: 'uber-data-heatmap',
            data: (async () => {
                const result = await d3.csv(DATA_API_URL + UBER_DATA_URL);
                console.log("Data result:", result);
                return result;
            })(),
            radius: 1000,
            coverage: 1,
            lowerPercentile: 1,
            upperPercentile: 100,
            colorRange: [
                [1, 152, 189],
                [73, 227, 206],
                [216, 254, 181],
                [254, 237, 177],
                [254, 173, 84],
                [209, 55, 78]
            ],
            elevationRange: [0, 100],
            elevationScale: 250,
            extruded: true,
            getPosition: (d: HexData) => [ Number(d.lng), Number(d.lat) ],
            opacity: 0.75
        }),
        new ScatterplotLayer({
            id: 'deckgl-circle',
            data: [
                { position: [0.45, 51.47] }
            ],
            getPosition: d => d.position,
            getFillColor: [255, 0, 0, 100],
            getRadius: 1000,
        })
    ]);
    const [ placeFilter, setPlaceFilter ] = useState(false);

    useEffect(() => {

        apiContext?.apiClient.get(WWB2S_DATA_URL)
            .then((result) => {
                console.log("Data result:", result["data"]!["features"]!);

                setLayers([
                    ...layers,
                    new HexagonLayer<DataType>({
                        id: 'places-hexmap',
                        data: (() => {
                            return ((!!result && result.hasOwnProperty("data")) ?
                                    result["data"]!["features"]! :
                                    []
                            )
                                .filter((!placeFilter) ?
                                    (d: PlaceData) => (!d.properties.b2s_flag):               // <= all places
                                    (d: PlaceData) => d.properties.b2s_flag // <= only b2s winners
                                )
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
                        lowerPercentile: 0,
                        upperPercentile: 100,
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
                    })
                ]);
            });

    }, [ apiContext ]);

    const onMove = (event: any) => {
        // console.log("new map view state:", event["viewState"]);
    }

    return (
        <Map mapboxAccessToken={MAPBOX_TOKEN}
             mapStyle={{...coriLightMapStyle}}
             initialViewState={{
                 longitude: 0.44,
                 latitude: 51.50,
                 pitch: 40.5,
                 zoom: 10.75
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

    return (
        <ApiContextProvider baseURL={DATA_API_URL}><>
            <SlippyMap />
            <ControlPanel />
        </></ApiContextProvider>
    );
}
