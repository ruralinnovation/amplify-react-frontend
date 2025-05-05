import * as React from 'react';
import * as ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { Authenticator } from '@aws-amplify/ui-react';
import { AuthError, signInWithRedirect } from '@aws-amplify/auth';

import { ApiContextProvider } from "@cori-risi/cori.data.api";

import outputs from "../amplify_outputs.json";

import App from './App';

import '@aws-amplify/ui-react/styles.css';
import "normalize.css";
import './index.css';

const DATA_API_URL = "https://cori-risi-apps.s3.amazonaws.com";

Amplify.configure(outputs);

// await (signInWithRedirect({
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

export function renderToDom(container: HTMLElement) {
  ReactDOM.createRoot(container).render(
      <React.StrictMode>
          <ApiContextProvider baseURL={DATA_API_URL}>
              <Authenticator
                  hideSignUp={true}
                  loginMechanisms={['email']} >
                  {({ signOut, user }) => (
                      <>
                              <App />
                          <p>To effectively sign out, first visit the&nbsp;
                              <a href={"https://d97d22aa2db0fb35e8a5.awsapps.com/start/#/?tab=applications"} target={"_blank"}>
                                  AWS access portal</a> in a new tab and select "Sign out" from the user drop-down menu.
                          </p>
                          <button onClick={signOut}>Sign out</button>
                      </>
                  )}
              </Authenticator>
          </ApiContextProvider>
      </React.StrictMode>
  );
}
