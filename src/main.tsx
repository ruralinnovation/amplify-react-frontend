import * as React from "react";
import * as ReactDOM from "react-dom/client";
// import { ReactElement, useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import {
    Authenticator,
    // withAuthenticator
} from '@aws-amplify/ui-react';
// import { AuthTokens, AuthError, fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';

import App from "./App.tsx";
import "./index.css";

import outputs from "../amplify_outputs.json";

import '@aws-amplify/ui-react/styles.css';

// type AWSCredentials = {
//     accessKeyId: string;
//     secretAccessKey: string;
//     sessionToken?: string;
//     expiration?: Date;
// };

// type AuthSession = {
//     tokens?: AuthTokens;
//     credentials?: AWSCredentials;
//     identityId?: string;
//     userSub?: string;
// };

Amplify.configure(outputs);

// (signInWithRedirect({
//     provider: {
//         custom: 'IAMIdentityCenter'
//     }
// }).catch((error) => {
//     if (error instanceof AuthError) {
//         console.log(error);
//
//         if (error.name === 'UserAlreadyAuthenticatedException') {
//             // do what ever you want !!!!
//         }
//     }
// }));

// let signInAttemptCount_local = 0;
// let hasAuthSession_local = false;
//
// function PrivacyAuthenticator (props: { children?: ReactElement }) {
//
//     const [ hasAuthSession, setAuthSession ] = useState(false);
//     const [ signInAttemptCount, setSignInAttemptCount ] = useState(0);
//
//     useEffect(() => {
//
//         setTimeout(async () => {
//
//             if (!hasAuthSession && !hasAuthSession_local) {
//
//                 console.log("Amplify configured with: ", {
//                     ...Amplify.getConfig()
//                 });
//
//                 hasAuthSession_local = true;
//                 signInAttemptCount_local = 1
//
//                 setAuthSession(hasAuthSession_local);
//
//                 await (fetchAuthSession!()
//                     .then((sess: AuthSession) => {
//
//                         console.log(sess);
//
//                         if (signInAttemptCount < 1) {
//                             console.log("Previous sign-in attempts: ", signInAttemptCount);
//
//                             setSignInAttemptCount(signInAttemptCount_local);
//
//                             if (!(sess === null && (sess as any).hasOwnProperty("tokens") && (sess as any)["tokens"].hasOwnProperty("idToken"))) {
//
//                                 /* If we CANNOT fetch a valid token (idToken) then present user with button to initiating SSO signin */
//
//                                 // (signInWithRedirect({
//                                 //         provider: {
//                                 //             custom: 'MyCalixStaging'
//                                 //         }
//                                 //     })
//                                 //         .catch((error) => {
//                                 //
//                                 //             if (error instanceof AuthError) {
//                                 //                 console.log(error);
//                                 //                 // console.log(error.cause);
//                                 //                 console.log(error.stack);
//                                 //                 console.log(error.recoverySuggestion)
//                                 //
//                                 //                 if (error.name === 'UserAlreadyAuthenticatedException') {
//                                 //                     // do what ever you want !!!!
//                                 //                 }
//                                 //             }
//                                 //         })
//                                 // );
//
//                                 // form data-amplify-form="" data-amplify-authenticator-signin="" method="post"
//                                 const amplifyAuthenticatorForm: HTMLFormElement | null = document.querySelector('form[data-amplify-form]');
//                                 if (amplifyAuthenticatorForm !== null) {
//
//                                     const brandingInformation = (document.getElementById("branding-info") === null) ?
//                                         document.createElement("div") : document.getElementById("branding-info");
//
//                                     brandingInformation!.id = "branding-info"
//                                     brandingInformation!.innerHTML = `
//   <!-- <span class="cori-logo"><img src="/Full-Logo_CORI_Dark-Teal.svg" /></span>-->
//   <p></p>
//   <br />
//   <h4>Amplify 2 Frontend with SAML 2.0</h4>
// `;
//                                     brandingInformation!.style.margin = "0 40px";
//
//                                     console.log(amplifyAuthenticatorForm);
//                                     (amplifyAuthenticatorForm).before(brandingInformation!);
//
//                                     const signInButton: HTMLButtonElement | null = amplifyAuthenticatorForm.querySelector('.amplify-button[type="submit"]');
//
//                                     if (signInButton !== null && signInButton.innerHTML === "Sign in") {
//                                         signInButton.innerHTML = "Continue to authenticate with IdP (SAML 2.0)";
//                                         signInButton.onclick = async function () {
//
//                                             console.log("Calling signInWithRedirect...");
//
//                                             const authResponse = await (signInWithRedirect({
//                                                 provider: {
//                                                     custom: 'IAMIdentityCenter'
//                                                 }
//                                             }).catch((error) => {
//                                                 if (error instanceof AuthError) {
//                                                     console.log(error);
//
//                                                     if (error.name === 'UserAlreadyAuthenticatedException') {
//                                                         // do what ever you want !!!!
//                                                     }
//                                                 }
//                                             }));
//
//                                             console.log("Completed signInWithRedirect:", authResponse);
//                                         };
//
//                                         const amplifyFormFieldset: HTMLInputElement | null = amplifyAuthenticatorForm.querySelector('fieldset.amplify-flex');
//                                         if (amplifyFormFieldset !== null) {
//                                             amplifyFormFieldset.style.display = "none";
//                                         }
//
//                                         const privacyInformation = (document.getElementById("privacy-info") === null) ?
//                                             document.createElement("div") :
//                                             document.getElementById("privacy-info");
//                                         privacyInformation!.id = "privacy-info"
//                                         privacyInformation!.innerHTML = `
//                     <p></p>
//                     <p>This Site uses cookies to offer you a better browsing experience and to analyze Site
//                         traffic. By continuing to access the Site, you consent to our use of cookies and storage and use of
//                         your data as provided in our <a href="http://ruralinnovation.us/privacy-policy/" target="_blank">Privacy Policy</a>.
//                     </p>
//                     <p></p>
// `;
//
//                                         const footerLoader: HTMLDivElement | null = document.querySelector('[data-amplify-footer]');
//                                         if (footerLoader !== null) {
//                                             footerLoader.style.background = "none";
//                                             // (footerLoader).after(privacyInformation!);
//                                             (footerLoader).before(privacyInformation!);
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     })
//                     .catch((error) => {
//
//                         console.log(error);
//                         // console.log(error.cause);
//                         console.log(error.stack);
//                         console.log(error.recoverySuggestion)
//
//                         if (error.hasOwnProperty("code")) {
//                             console.log("Error code:", error.code!);
//                             // if (error.code! === "ERR_BAD_REQUEST"
//                             //     || error.code! === "ERR_NETWORK"
//                             // ) {
//                             //     autoSignOut();
//                             //
//                             // } else if (error.code === 'ERR_NAME_NOT_RESOLVED') {
//                             //     console.error('Invalid baseURL:', apiClient.defaults.baseURL);
//                             //     // Handle invalid baseURL error
//                             // }
//                         } else {
//                             console.log(error.toString());
//                         }
//                     })
//                 );
//             }
//         }, 533);
//     }, [ hasAuthSession, setSignInAttemptCount ]);
//
//     return (
//         <div className={"app-with-authenticator"}>
//             {props.children}
//         </div>
//     );
// }
//
// // const signInFormFields = {
// //     signIn: {
// //         username: {
// //             placeholder: "", //Enter your cool email',
// //         },
// //         password: {
// //             placeholder: "", //Enter your super secret password',
// //         },
// //     }
// // };
//
// const AppWithAuthenticator = withAuthenticator(App, {
//     // formFields: signInFormFields,
//     hideSignUp: true,
//     loginMechanisms: ['email']
// });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      {/*{(!!window.location.port && window.location.port.toString() === "5173") ? (*/}
          <Authenticator
              hideSignUp={true}
              loginMechanisms={['email']} >
              {({ signOut, user }) => (
                  <>
                      <App />
                      <p>To effectively sign out, first visit the <a href={"https://d97d22aa2db0fb35e8a5.awsapps.com/start/#/?tab=applications"} target={"_blank"}>
                          AWS access portal</a> in a new tab and select "Sign out" from the user drop-down menu.
                          { (function () {
                              console.log("user:", user);
                              return true;
                          })()}
                      </p>
                      <button onClick={signOut}>Sign out</button>
                  </>
              )}
          </Authenticator>
      {/*) : (*/}
      {/*    <PrivacyAuthenticator>*/}
      {/*        /!*<App />*!/*/}
      {/*        <AppWithAuthenticator />*/}
      {/*    </PrivacyAuthenticator>*/}
      {/*)}*/}
  </React.StrictMode>
);
