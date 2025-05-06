import * as React from 'react';
import * as ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import { AuthError } from '@aws-amplify/auth';

import { 
    AmplifyContextProvider,
    ApiContextProvider,
    SSOAuthenticator
} from "@cori-risi/cori.data.api";

import amplify_outputs from "../amplify_outputs.json";

import App from './App';

import "normalize.css";

import '@aws-amplify/ui-react/styles.css';
import "@cori-risi/cori.data.api/inst/dist/cori.data.api.css";
import './@cori-risi/components/style/CustomAmplifyAuthenticator.css';
import './@cori-risi/components/style/images/loading.gif';
import coriLogo from "./@cori-risi/assets/images/Full-Logo_CORI_Dark-Teal.svg";

import './index.css';

Amplify.configure(amplify_outputs);

const DATA_API_URL = `https://${amplify_outputs["storage"]["buckets"][0]["bucket_name"]}.s3.amazonaws.com`;

export function renderToDom(container: HTMLElement, title: string) {

    console.log("Amplify.configure called with amplify_amplify_outputs: ", amplify_outputs);
    console.log("... with Data API URL: ", DATA_API_URL);

    setTimeout(() => {
        // form data-amplify-form="" data-amplify-authenticator-signin="" method="post"
        const amplifyAuthenticatorForm: HTMLFormElement | null = document.querySelector('form[data-amplify-form]');
        if (amplifyAuthenticatorForm !== null) {

            const brandingInformation = (document.getElementById("branding-info") === null) ?
                document.createElement("div") : document.getElementById("branding-info");

            brandingInformation!.id = "branding-info"
            brandingInformation!.innerHTML = `            
  <span class="cori-logo"><img src="${coriLogo}"  alt="${title + " Logo"}"/></span>
  <p></p>
  <br />
  <h4>${title}</h4>
`;

            console.log(amplifyAuthenticatorForm);
            (amplifyAuthenticatorForm).before(brandingInformation!);

            const signInButton: HTMLButtonElement | null = amplifyAuthenticatorForm.querySelector('.amplify-button[type="submit"]');

            if (signInButton !== null && signInButton.innerHTML === "Sign in") {

                const privacyInformation = (document.getElementById("privacy-info") === null) ?
                    document.createElement("div") :
                    document.getElementById("privacy-info");
                privacyInformation!.id = "privacy-info"
                privacyInformation!.innerHTML = `
                    <p></p>
                    <p>This Site uses cookies to offer you a better browsing experience and to analyze Site
                        traffic. By continuing to access the Site, you consent to our use of cookies and storage and use of
                        your data as provided in our <a href="http://ruralinnovation.us/privacy-policy/" target="_blank">Privacy Policy</a>.
                    </p>
                    <p></p>
`;

                const footerLoader: HTMLDivElement | null = document.querySelector('[data-amplify-footer]');
                if (footerLoader !== null) {
                    footerLoader.style.background = "none";
                    (footerLoader).before(privacyInformation!);
                }
            }
        }
    }, 533);

    ReactDOM.createRoot(container).render(
        <React.StrictMode>
            <AmplifyContextProvider
                domain={amplify_outputs["auth"]["oauth"]["domain"] || import.meta.env.VITE_COGNITO_DOMAIN}
                region={amplify_outputs["auth"]["aws_region"]  || import.meta.env.VITE_REGION}
                identityPoolId={amplify_outputs["auth"]["identity_pool_id"]  || import.meta.env.VITE_IDENTITY_POOL_ID}
                userPoolId={amplify_outputs["auth"]["user_pool_id"]  || import.meta.env.VITE_USER_POOL_ID}
                userPoolClientId={amplify_outputs["auth"]["user_pool_client_id"]  || import.meta.env.VITE_USER_POOL_CLIENT_ID} >
                <ApiContextProvider baseURL={DATA_API_URL}>
                    {/*<SSOAuthenticator*/}
                    {/*    provider={(import.meta.env.VITE_SSO_PROVIDER || "IAMIdentityCenter")}*/}
                    {/*    title={title}*/}
                    {/*    logo={coriLogo} >*/}
                        <Authenticator
                            hideSignUp={true}
                            loginMechanisms={['email']} >
                            {({ signOut, user }) => (
                                <>
                                    <App />
                                    {/*<p>To effectively sign out, first visit the&nbsp;*/}
                                    {/*    <a href={"https://d97d22aa2db0fb35e8a5.awsapps.com/start/#/?tab=applications"} target={"_blank"}>*/}
                                    {/*        AWS access portal</a> in a new tab and select "Sign out" from the user drop-down menu.*/}
                                    {/*</p>*/}
                                    <button onClick={() => {
                                        setTimeout(() => {
                                            const footerLoader: HTMLDivElement | null = document.querySelector('[data-amplify-footer]');
                                            if (footerLoader !== null) {
                                                footerLoader.style.background = "none";
                                            }
                                        }, 533);
                                        if (typeof signOut === "function") signOut();
                                    }}>Sign out</button>
                                </>
                            )}
                        </Authenticator>
                        {/*<AmplifyApp></AmplifyApp>*/}
                    {/*</SSOAuthenticator>*/}
                </ApiContextProvider>
            </AmplifyContextProvider>
        </React.StrictMode>
    );
}
