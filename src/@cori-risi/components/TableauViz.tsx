import * as React from "react";
import { useEffect } from "react";
import CryptoJS from "crypto-js";
import { SheetType, TableauEventType } from "@tableau/embedding-api";

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

const userAttributes = {
    //  User attributes are optional.
    //  Add entries to this dictionary if desired.
    //  "[User Attribute Name]": "[User Attribute Value]",
};

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
        "exp": Math.round(new Date().getTime() / 1000) + tokenExpiryInMinutes * 60,
        // ...userAttributes
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

export default function TableauViz ({ attach_content = true, content, content_selector, content_timeout }: { attach_content?: boolean, content: () => HTMLElement, content_selector: string | null, content_timeout: number | null }) {

    const container_class_name = "tableau-viz-container";
    let content_loaded = false;

    function addContentToCurrentComponent () {
        if (content_selector && content_timeout !== null) {
            setTimeout(function () {
                if (!content_loaded) {
                    // Anything in here is fired on component mount.
                    const viz_container = (document.getElementsByClassName(container_class_name))[0];
                    if (!!viz_container && viz_container !== null && typeof viz_container.insertAdjacentElement === "function") {
                        const viz_content: HTMLElement | null = (typeof content === 'function') ?
                            content() :
                            null;

                        // Get the viz object from the HTML web component
                        const viz = viz_content?.querySelector(content_selector);

                        if (viz !== null) {

                            if (viz_content !== null
                                && viz_content.childNodes !== null
                                && viz_content.childNodes.length > 0
                            ) {

                                setTimeout((container) => {
                                    console.log(`Will append content to ${viz_container.className}: `, viz_content);
                                    viz_content.childNodes.forEach((c: ChildNode) => {
                                        if (c.nodeType === 1) {
                                            const element: HTMLElement = c as HTMLElement;
                                            container.insertAdjacentElement('beforeend', element);
                                        }
                                    });

                                }, 53, viz_container);
                            }

                            // // window.token is the JWT generated using a Connected App configured with Direct Trust.
                            // // The value is generated and is only available when this code executes within the Embedding Playground.
                            // // See the Connected Apps documentation (https://sfdc.co/ca-direct) for more information.
                            // // See this repository (https://sfdc.co/ca-jwt) for samples in constious languages.
                            // viz.token = window.token;
                            // viz.token = generateJwt();
                            (viz as any).token = createToken(userId, secretId, secret, clientId, scopes);

                            new Promise<void>((resolve, reject) => {
                                console.log("About to reference @tableau/embedding-api...");
                                // Add an event listener to verify the viz becomes interactive
                                (viz as any).addEventListener(TableauEventType.FirstInteractive, () => {
                                    console.log('Viz is interactive!');
                                    resolve();
                                });

                                (viz as any).addEventListener(TableauEventType.VizLoadError, (error: any) => {
                                    const message = JSON.parse(error.detail.message);
                                    const errorMessage = JSON.parse(message.errorMessage);
                                    const displayMessage = `ca-error-${errorMessage.result.errors[0].code}`;

                                    console.log("Error", displayMessage, message);

                                    reject(displayMessage);
                                });
                            })
                                .then((res) => {
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

                                    console.log("Tableau Viz Dashboard: ", dashboard);
                                    console.log("Tableau Viz Worksheet: ", worksheet);
                                });
                        }

                        content_loaded = true;
                    }
                }
            }, (content_timeout + 1000));
        }
    }

    useEffect( () => {
        if (!!attach_content) {
            addContentToCurrentComponent();
        } else {
            content_loaded = true;
        }
    } , []);
    
    return (
        <div className={container_class_name}>
            {/* <tableau-viz>Tableau Embedded Analytics Content Will Be Placed HERE</tableau-viz> */}
        </div>
    );
}
