import * as React from "react";
import { useEffect } from "react";
import { SheetType, TableauEventType } from "@tableau/embedding-api";

import { enc, lib, HmacSHA256 } from "crypto-js";
// import { hmac } from '@noble/hashes/hmac';
// import { sha256 } from '@noble/hashes/sha2';

// Replace the example values below (remove the brackets).
// Store secrets securely based on your team's best practices.
// See: https://help.tableau.com/current/online/en-us/connected_apps_direct.htm

// TODO: ENVIRONMENT VARS DO NO WORK WHEN EMBEDDED IN QUARTO!
//   ... so the following imports have to be replaced with literal values >:P
const clientId = import.meta.env.VITE_TABLEAU_CLIENT_ID;
const secretId = import.meta.env.VITE_TABLEAU_SECRET_ID;
const secret = import.meta.env.VITE_TABLEAU_SECRET_VALUE;
const userId = import.meta.env.VITE_TABLEAU_USER;
const tokenExpiryInMinutes = 10; // Max of 10 minutes.

/** Based on MDN Web Crypto API example from:
 *   https://github.com/mdn/dom-examples/blob/df86b2c350565104dcb772a2b259da94d4f1c91a/web-crypto/sign-verify/hmac.js
 *
 *  Get the encoded message-to-sign, sign it and display a representation
 *  of the first part of it in the "signature" element.
 *
 * @example
 *    async function signMessage(key) {
 *        const signatureValue = document.querySelector(".hmac .signature-value");
 *        signatureValue.classList.remove("valid", "invalid");
 *
 *        let encoded = getMessageEncoding();
 *        signature = await window.crypto.subtle.sign(
 *            "HMAC",
 *            key,
 *            encoded
 *        );
 *
 *        signatureValue.classList.add('fade-in');
 *        signatureValue.addEventListener('animationend', () => {
 *            signatureValue.classList.remove('fade-in');
 *        });
 *        let buffer = new Uint8Array(signature, 0, 5);
 *        signatureValue.textContent = `${buffer}...[${signature.byteLength} bytes total]`;
 *    }
 *
 */
async function signKey (message: string, secret: string): Promise<ArrayBuffer> {

    const enc1 = new TextEncoder();
    const encoded = enc1.encode(message);

    const key = await window.crypto.subtle.importKey(
        "raw", // raw format of the key - should be Uint8Array
        enc1.encode(secret),
        { // algorithm details
            name: "HMAC",
            hash: {name: "SHA-256"}
        },
        false, // export = false
        ["sign", "verify"] // what this key can do
    );

    return window.crypto.subtle.sign(
        "HMAC",
        key,
        encoded
    );
}

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

function base64url(source: lib.WordArray | Uint8Array) {
    let encodedSource = (source instanceof Uint8Array) ?
        (new TextDecoder('utf8')).decode(source) :
        enc.Base64.stringify(source);
    encodedSource = encodedSource.replace(/=+$/, '');
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');
    return encodedSource;
}

function base64url2(source: Uint8Array) {
    return btoa((new TextDecoder('utf8')).decode(source));
}

function createToken (userid: string, kid: string, secret: string, iss: string, scp: string[]){
    const header = {
        "alg": "HS256",
        "typ": "JWT",
        "iss": iss,
        "kid": kid,
    };
    console.log("Encode header:", header);
    const stringifiedHeader = enc.Utf8.parse(JSON.stringify(header));
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
    console.log("Encode claimSet:",claimSet);
    const stringifiedData = enc.Utf8.parse(JSON.stringify(claimSet));
    const encodedData = base64url(stringifiedData);
    const token = encodedHeader + "." + encodedData;
    console.log("Encode token (encoded header + encoded claimSet):", token);
    // const stringifiedSignature = CryptoJS.HmacSHA256(token, secret);
    const stringifiedSignature = HmacSHA256(token, secret);
    // const stringifiedSignature = hmac(sha256, secret, token);
    // TODO:: Create my own hmac256 function???
    console.log("Base64 encode signature:", stringifiedSignature);
    const signature = base64url(stringifiedSignature);
    // const signature = base64url2(stringifiedSignature as Uint8Array);
    const signedToken = token + "." + signature;

    console.log(signedToken);

    return signedToken;
}

export default function TableauViz ({ attach_content = true, content, content_selector, content_timeout }: { attach_content?: boolean, content: () => HTMLElement, content_selector: string | null, content_timeout: number | null }) {

    const container_class_name = "tableau-viz-container";
    let content_loaded = false;

    function addContentToCurrentComponent (viz_content: HTMLElement) {
        console.log("Ready to attach content:", attach_content, content_selector, content_timeout);

        if (content_selector !== null) {
            if (!content_loaded) {
                // Anything in here is fired on component mount.
                const viz_container = (document.getElementsByClassName(container_class_name))[0];

                if (!!viz_container && viz_container !== null && typeof viz_container.insertAdjacentElement === "function") {

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


                    content_loaded = true;
                }
            }
        }
    }

    useEffect( () => {

        if (content_selector !== null && content_timeout !== null) {
            setTimeout(function () {

                const viz_content: HTMLElement | null = (typeof content === 'function') ?
                    content() :
                    null;

                console.log("viz_content:", viz_content);

                if (viz_content !== null) {

                    // Get the viz object from the HTML web component
                    const viz = viz_content?.querySelector(content_selector);

                    console.log("viz:", viz);

                    // // window.token is the JWT generated using a Connected App configured with Direct Trust.
                    // // The value is generated and is only available when this code executes within the Embedding Playground.
                    // // See the Connected Apps documentation (https://sfdc.co/ca-direct) for more information.
                    // // See this repository (https://sfdc.co/ca-jwt) for samples in constious languages.
                    // // viz.token = window.token;
                    // // viz.token = generateJwt();
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

                    if (!!attach_content && viz !== null) {
                        addContentToCurrentComponent(viz_content);
                    } else {
                        content_loaded = true;
                    }
                }
            }, (content_timeout + 1000));
        }
    } , []);

    return (
        <div className={container_class_name}>
            {/* <tableau-viz>Tableau Embedded Analytics Content Will Be Placed HERE</tableau-viz> */}
        </div>
    );
}
