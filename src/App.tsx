import * as React from 'react';
import * as d3 from 'd3';
import Map, {GeolocateControl, NavigationControl, ScaleControl, useControl} from 'react-map-gl';
import { DeckProps } from '@deck.gl/core';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import { ScatterplotLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';

import GeocoderControl from "./@cori-risi/components/GeocoderControl";

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const UBER_DATA_URL: string = "https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv";

function DeckGLOverlay(props: DeckProps) {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
}

export default function App() {

    type HexData = {
        lng: number,
        lat: number
    };

    const layers  = [
        new HexagonLayer<HexData>({
            id: 'deckgl-heatmap',
            data: d3.csv(UBER_DATA_URL),
            radius: 1000,
            coverage: 1,
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
    ];

    const onMove = (event: any) => {
        console.log("new map view state:", event["viewState"]);
    }

    return (
        <>
            <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                initialViewState={{
                    longitude: 0.44,
                    latitude: 51.50,
                    pitch: 40.5,
                    zoom: 10.75
                }}
                onMove={onMove}
            >
                <DeckGLOverlay
                    initialViewState={{
                        longitude: -79.4512,
                        latitude: 43.6568,
                        zoom: 13
                    }}
                    layers={layers}/>
                <GeocoderControl mapboxAccessToken={MAPBOX_TOKEN} position="top-left" />
                <GeolocateControl position="top-left" />
                <NavigationControl position="top-left" />
                <ScaleControl  position="bottom-left"
                               unit={"imperial"} />
            </Map>
            {/*<ControlPanel />*/}
        </>
    );
}
