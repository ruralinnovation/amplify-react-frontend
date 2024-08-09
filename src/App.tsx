import * as React from 'react';
import { useContext, useEffect, useState } from "react";
import * as d3 from 'd3';
import { format } from 'd3-format';
import { Layer, DeckProps } from "deck.gl";
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';
import Map, { GeolocateControl, NavigationControl, ScaleControl, useControl } from 'react-map-gl';

import { ApiContext, ApiContextProvider, HoverInfo, HoverObject, coriLightMapStyle } from "@cori-risi/cori.data.api";

import ControlPanel from "./@cori-risi/components/ControlPanel";
import GeocoderControl from "./@cori-risi/components/GeocoderControl";

import 'mapbox-gl/dist/mapbox-gl.css';

const DATA_API_URL = "https://cori-risi-apps.s3.amazonaws.com";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const WWB2S_DATA_URL: string = "/examples/who-wins-b2s/rural_places_2500_plus.json";

type AggregateAccessor<DataT = any> = (args: {
    /** a list of objects whose positions fall inside this cell. */
    objects: DataT[];
    objectInfo: {
        /** the indices of `objects` in the original data. */
        indices: number[];
        /** the value of the `data` prop */
        data: any;
    };
}) => number;

type HexData = {
    value: number | any;
    centroid: [longitude: number, latitude: number];
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

function SlippyMap (props: { dataFilter: { checked: boolean, range: number[], size: number}, setHoverInfo: Function }) {

    const apiContext = useContext(ApiContext);

    let fetchingPlaceData = false;

    const [ layers, setLayers ] = useState<Layer[]>([]);

    const layerMetric =  "prop_score_model2_min_pop_rq_2.5K";

    const getAggregateMaximumValue: AggregateAccessor<HexData> = (data) => {
        return (d3.max((data as unknown as any[]).map(d => +d.value[layerMetric])) || 0.0);
    };

    const getAggregateMedianValue: AggregateAccessor<HexData> = (data) => {
        return (d3.median((data as unknown as any[]).map(d => +d.value[layerMetric])) || 0.0);
    };

    const updatePlaceLayer = (places: PlaceData[], range: number[], size: number ) => {

        const aggPlaceDetails: any[] = [];

        setLayers([
            new ScatterplotLayer<HexData>({
                id: 'deckgl-circle',
                data: places
                    .filter((d: PlaceData) => d.properties.b2s_flag )
                    .map((d: PlaceData) => {
                        return {
                            value: +d.properties[layerMetric],
                            centroid: Float32Array.from(d.geometry.coordinates)
                        };
                    }),
                getPosition: d => d.centroid,
                getFillColor: [ 255, 0, 0, 100 ],
                getRadius: 10000,
            }),
            new HexagonLayer<HexData>({
                id: 'deckgl-places-hex',
                data: (() => {
                    return places
                        .map((d: PlaceData) => {
                            return {
                                value: d.properties,
                                centroid: Float32Array.from(d.geometry.coordinates)
                            };
                        });
                })(),
                coverage: 1,
                colorRange: [
                    [255, 255, 255, 127],
                    [216, 254, 181, 255],
                    [216, 254, 181, 255],
                    [216, 254, 181, 255],
                    [73, 227, 206, 255],
                    [73, 227, 206, 255],
                    [73, 227, 206, 255],
                    [73, 227, 206, 255],
                    [1, 152, 189, 255],
                    [1, 152, 189, 255],
                    [1, 152, 189, 255]
                ],
                extruded: true,
                elevationRange: [1, 100],
                elevationScale: 2500,
                autoHighlight: true,
                highlightColor: [255, 128, 115, 255],
                lowerPercentile: range[0] || 0,
                upperPercentile: range[1] || 100,
                radius: 29000 * (size / 100),   // meters: Unit or "level" of hexgrid
                                                // ... like "zoom" level in slippy coords
                getColorValue: (data) => {
                    // console.log("(objects: HexData[]) => ", data);
                    aggPlaceDetails.push(data); // <= only do this once
                    return getAggregateMaximumValue(data);
                },
                getElevationValue: (data) => {
                    // What is this calculation called in statistical terms?
                    // Given a subset of N scores out of a total set of M scores:
                    // (Median x N) / M
                    const median = getAggregateMedianValue(data),
                        n = (data as unknown as any[]).length || 0,
                        m = places.length;
                    return (median * n) / m;
                },
                getPosition: (d: HexData) => d.centroid,
                pickable: true,
                opacity: 0.25,
                onHover: (info) => {
                    console.log(info);

                    if (!!info.picked
                        && info.hasOwnProperty("object")
                        && info["object"] !== null
                        && info["object"].hasOwnProperty("index")
                    ) {
                        const data_index = info.object.index;
                        console.log("current place index:", data_index);
                        if ((aggPlaceDetails.length || 0) > data_index) {
                            const place = aggPlaceDetails[Number(data_index)];
                            console.log("Place:", place);

                            if (!!place) {
                                props.setHoverInfo({
                                    x: info.x,
                                    y: info.y,
                                    name: place.reduce((a: {value: string}, d: any) => {
                                        console.log(a)
                                        if (!!d.value) {
                                            console.log(d.value.NAME + ", " + d.value.STUSPS);
                                            return {
                                                value: a.value + d.value.NAME + ", " + d.value.STUSPS + "; "
                                            };
                                        } else
                                            return a;
                                    }, { value: "" }).value,
                                    values: place
                                        .sort((a: any, b: any) => (
                                            (!!a.value && !!b.value
                                                && a.value[layerMetric] < b.value[layerMetric])
                                        ))
                                        .map((d: any) => ((!!d.value) ? {
                                            name: d.value.NAME + ", " + d.value.STUSPS,
                                            b2s_flag: d.value.b2s_flag, // (!!info.object.properties.b2s_flag),
                                            prop_score: d.value[layerMetric],
                                            prop_score_knearest_match: d.value.prop_score_knearest_match,
                                            pct_rural: d.value.pct_rural,  // (!!info.object.properties.pct_rural),
                                            pop: d.value.pop,
                                            bach_or_higher: d.value.bach_or_higher,
                                            pct_bach_or_higher: d.value.pct_bach_or_higher,
                                            cpu_math_occupations: d.value.cpu_math_occupations,
                                            diversity_score: d.value.diversity_score,
                                            pct_prime_emp: d.value.pct_prime_emp,
                                            rural_capacity_index: d.value.rural_capacity_index,
                                            tech_share: d.value.tech_share,
                                            tot_emp_by_occ: d.value.tot_emp_by_occ
                                        } : {}))
                                });
                            }
                            return true;
                        }
                    } else {
                        props.setHoverInfo(null);
                    }
                    return false;
                }
            }),
        ]);
    };

    useEffect(() => {

        if (!!apiContext
            // If apiContext.data.placeData is undefined...
            && !apiContext.data.hasOwnProperty("placeData")
            && !fetchingPlaceData
        ) {

            // ... ensures "placeData" is fetched only once (see console)
            fetchingPlaceData = true;

            apiContext.setData({
                ...(apiContext?.data || {}),
                placeData: null
            });

            apiContext?.apiClient.get(WWB2S_DATA_URL)
                .then((result) => {

                    if (!!result && result.hasOwnProperty("data")) {

                        console.log("Data result:", result["data"]!["features"]!);

                        const placeData = result["data"]!["features"]!;

                        apiContext.setData({
                            ...apiContext.data,
                            placeData
                        });

                        updatePlaceLayer(
                            placeData
                                .filter((!!props.dataFilter.checked) ?
                                    (d: PlaceData) => d.properties.b2s_flag :   // <= only b2s winners
                                    (d: PlaceData) => !!d                      // <= other places
                                ),
                            props.dataFilter.range,
                            props.dataFilter.size || 1
                        );

                        fetchingPlaceData = false;
                    }
                });
        }

    }, [ apiContext?.data ]);

    useEffect(() => {
        if (!!apiContext && !!apiContext.data && (apiContext?.data?.placeData?.length || 0) > 0) {
            console.log(`Hex radius: ${(29000 * ((props.dataFilter.size || 1) / 100))} meters`);

            updatePlaceLayer(apiContext.data
                .placeData
                    .filter((!!props.dataFilter.checked) ?
                        (d: PlaceData) => d.properties.b2s_flag :   // <= only b2s winners
                        (d: PlaceData) => !!d                      // <= all other places
                    ),
                props.dataFilter.range,
                props.dataFilter.size || 1
            );
        }
    }, [ props.dataFilter ]);

    return (
        <Map mapboxAccessToken={MAPBOX_TOKEN}
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
            {(apiContext !== null) &&
                <DeckGLOverlay layers={layers}/>
            }
            <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN} position="top-right" />
            <GeolocateControl position="top-right" />
            <NavigationControl position="top-right" />
            <ScaleControl  position="bottom-right"
                           unit={"imperial"} />
        </Map>
    );
}

export default function App() {

    const [ hoverInfo, setHoverInfo ] = useState<HoverObject | null>(null);

    const [ placeFilter, setPlaceFilter ] = useState({
        "checked": false,
        "range": [0, 100],
        "size": 100
    });

    return (
        <ApiContextProvider baseURL={DATA_API_URL}>
            <SlippyMap dataFilter={placeFilter} setHoverInfo={setHoverInfo} />
            <ControlPanel setFilterState={setPlaceFilter} />
            {(hoverInfo !== null) ?
                <HoverInfo hoverInfo={hoverInfo}>
                    <div style={{pointerEvents: "none"}}>
                        <h3>{ hoverInfo.name }</h3>
                        {hoverInfo.values.map((h: any) => (
                            <div key={h.name.replace(/\s/g, "_")}>
                                <hr></hr>
                                <a>{ h.name }</a>
                                <p className={'prop-score'}>
                                    Propensity score: {h.prop_score*100 < 1? "<1": format(".2")(h.prop_score * 100)} | Matching: {h.prop_score_knearest_match? "Yes": "No"}<br/>
                                </p>
                                <p className={'details'}>
                                    B2S winner: {h.b2s_flag? "Yes": "No"}<br/>
                                    Population: {format(",")(h.pop)}<br/>
                                    Percent employed: {format(".0%")(h.pct_prime_emp)}<br/>
                                    Tech share: {format(".0%")(h.tech_share)}
                                </p>
                            </div>
                        ))}
                    </div>
                </HoverInfo> :
                <></>
            }
        </ApiContextProvider>
    );
}
