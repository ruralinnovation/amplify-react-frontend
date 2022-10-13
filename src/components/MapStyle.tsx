import type {GeoJSONSourceRaw, FillLayer, LineLayer} from 'react-map-gl';

import MAP_STYLE from '../map-style-basic-v8.json';

// For more information on data-driven styles, see https://www.mapbox.com/help/gl-dds-ref/
const sfNeighborhoods: GeoJSONSourceRaw = {
  type: 'geojson',
  data: 'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/feature-example-sf.json'
};

export const fillLayer: FillLayer = {
  id: 'county_broadband_farm_bill_eligibility_fill_layer',
  source: 'test',
  type: 'fill',
  paint: {
    'fill-color': '#0080ff', // blue color fill
    'fill-opacity': 0.5,
  },
};

export const lineLayer: LineLayer = {
  id: 'county_broadband_farm_bill_eligibility_line_layer',
  source: 'test',
  type: 'line',
  paint: {
    'line-color': 'black',
  },
};

// Make a copy of the map style
export default {
  ...MAP_STYLE,
  // sources: {
  //   ...MAP_STYLE.sources,
  //   "mapbox": {
  //     "url": "mapbox://styles/mergingfutures/ckyn2t9jv0una14prs29fkgy2",
  //     "type": "vector"
  //   }
  // }
};
