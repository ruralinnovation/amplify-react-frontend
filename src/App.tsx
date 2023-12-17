import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import ContextProvider from './contexts/ContextProvider';
import ApiContextProvider from "@cori-risi/cori.data.api";
import MapContainer from './components/Map';
import aws_config from "./amplifyConfig";

function App() {

  (function init () {
    // Check access to react/vite environment variables
    // @ts-ignore
    console.log("Welcome to Amplify React app version:", import.meta.env.VITE_APP_VERSION)
    console.log(aws_config);
  });

  return (
    <ContextProvider>
      <ApiContextProvider>
        <CssBaseline />
        <MapContainer />
      </ApiContextProvider>
    </ContextProvider>
  );
}

export default App;
