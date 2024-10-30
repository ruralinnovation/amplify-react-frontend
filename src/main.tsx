import * as React from 'react';
import { createRoot } from 'react-dom/client';

// import { default as sign } from "jwt-encode";
// import * as uuid from "uuid";

import * as tableau from "@tableau/embedding-api";
import { SheetType, TableauEventType } from "@tableau/embedding-api";
import CryptoJS from "crypto-js";
import { ApiContextProvider } from "@cori-risi/cori.data.api";

import App from './App';

import "normalize.css";
import './index.css';


const DATA_API_URL = "https://cori-risi-apps.s3.amazonaws.com";

// Replace the example values below (remove the brackets).
// Store secrets securely based on your team's best practices.
// See: https://help.tableau.com/current/online/en-us/connected_apps_direct.htm

const clientId = import.meta.env.VITE_TABLEAU_CLIENT_ID;
const secretId = import.meta.env.VITE_TABLEAU_SECRET_ID;
const secret = import.meta.env.VITE_TABLEAU_SECRET_VALUE;
const userId = import.meta.env.VITE_TABLEAU_USER;
const tokenExpiryInMinutes = 10; // Max of 10 minutes.

// Remove 'tableau:views:embed_authoring' scope if Authoring is not needed.
// Remove 'tableau:insights:embed' scope if Pulse is not needed.
const scopes = [
    // "tableau:insights:embed",
    // "tableau:views:embed_authoring",
    "tableau:views:embed"
];

// const userAttributes = {
//     //  User attributes are optional.
//     //  Add entries to this dictionary if desired.
//     //  "[User Attribute Name]": "[User Attribute Value]",
// };

// // First tried this function... could not authenticate with resulting JWT...
// function generateJwt() {
//
//   const header = {
//     alg: "HS256",
//     typ: "JWT",
//     kid: secretId,
//     iss: clientId
//   };
//
//   const data = {
//     jti: uuid.v4(),
//     iss: clientId,
//     aud: "tableau",
//     sub: userId,
//     scp: scopes,
//     iat: Math.floor(Date.now() / 1000),
//     exp: Math.floor(Date.now() / 1000) + tokenExpiryInMinutes * 60,
//     // ...userAttributes
//   };
//
//   const token = sign(data, secret, { header });
//   console.log(token);
//
//   return token;
// }

function base64url(source: CryptoJS.lib.WordArray) {
    let encodedSource = CryptoJS.enc.Base64.stringify(source);
    encodedSource = encodedSource.replace(/=+$/, '');
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');
    return encodedSource;
}

function createToken (userid: string, kid: string, secret: string, iss: string, scp: string[]){
    const header = {
        "alg": "HS256",
        "typ": "JWT",
        "iss": iss,
        "kid": kid,
    };
    const stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    const encodedHeader = base64url(stringifiedHeader);
    const claimSet = {
        "sub": userid,
        "aud": "tableau",
        "nbf": Math.round(new Date().getTime() / 1000) - 100,
        "jti": new Date().getTime().toString(),
        "iss": iss,
        "scp": scp,
        "exp": Math.round(new Date().getTime() / 1000) + tokenExpiryInMinutes * 60
    };
    const stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(claimSet));
    const encodedData = base64url(stringifiedData);
    const token = encodedHeader + "." + encodedData;
    const stringifiedSignature = CryptoJS.HmacSHA256(token, secret);
    const signature = base64url(stringifiedSignature);
    const signedToken = token + "." + signature;

    console.log(signedToken);

    return signedToken;
}

// Get the viz object from the HTML web component
const viz = document.querySelector('tableau-viz, tableau-authoring-viz');

// window.token is the JWT generated using a Connected App configured with Direct Trust.
// The value is generated and is only available when this code executes within the Embedding Playground.
// See the Connected Apps documentation (https://sfdc.co/ca-direct) for more information.
// See this repository (https://sfdc.co/ca-jwt) for samples in constious languages.
// viz.token = window.token;
// viz.token = generateJwt();
(viz as any).token = createToken(userId, secretId, secret, clientId, scopes);

// Wait for the viz to become interactive
new Promise<void>((resolve, reject) => {
    // Add an event listener to verify the viz becomes interactive
    (viz as any).addEventListener(TableauEventType.FirstInteractive, () => {
        console.log('Viz is interactive!');
        resolve();
    });

    (viz as any).addEventListener(TableauEventType.VizLoadError, (error: any) => {
        const message = JSON.parse(error.detail.message);
        const errorMessage = JSON.parse(message.errorMessage);

        const displayMessage = `ca-error-${errorMessage.result.errors[0].code}`;
        reject(displayMessage);
    });
}).then((res) => {
    let dashboard;
    let worksheet;
    if ((viz as any).workbook.activeSheet?.sheetType === SheetType?.Dashboard) {
        dashboard = (viz as any).workbook.activeSheet;

        // Provide the name of the worksheet you want to use from the dashboard
        worksheet = (dashboard as any)?.worksheets.find((ws: any) => ws.name === 'Replace-Name-of-Worksheet');
    } else {
        // Active sheet is already a worksheet
        worksheet = (viz as any).workbook.activeSheet;
    }
});

export function renderToDom(container: HTMLElement) {

  createRoot(container).render(<React.StrictMode>
      <ApiContextProvider baseURL={DATA_API_URL}>
          <App />
      </ApiContextProvider>
  </React.StrictMode>);
}
