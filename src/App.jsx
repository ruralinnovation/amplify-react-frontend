import '@aws-amplify/ui-react/styles.css';
import './App.css';
import './components/Header.css';
import reactLogo from './assets/react.svg';

import { Component, useEffect, useState } from 'react';
import ActionButton from './components/ActionButton';
import AbstractingContainersAndItems from "./components/material-ui/AbstractingContainersAndItems";
import FillingSpace from "./components/material-ui/FillingSpace";
import UnderstandingBreakpoints from "./components/material-ui/UnderstandingBreakpoints";

import aws_config from "./aws-config";
import '@aws-amplify/ui-react/styles.css';
import * as aws_amplify_react from "aws-amplify-react";
import { Auth } from "@aws-amplify/auth";
import { AuthState } from '@aws-amplify/ui-components';

const Authenticator = aws_amplify_react.Authenticator;
const SignIn = aws_amplify_react.SignIn;
const SignOut = aws_amplify_react.SignOut;

export class CustomSignIn extends SignIn {
    constructor(props) {
        super(props);

        this.state = {
            Username : '',
            Password : '',
            error: ''
        };
        this.signIn = this.signIn.bind(this);
        this.handleFormSubmission = this.handleFormSubmission.bind(this);
        this.SetAuthState = props.SetAuthState;
        this.SetUser = props.SetUser;
    }

    async handleFormSubmission(evt) {
        evt.preventDefault();
        console.log("Attempting to sign-in ...")
        await this.signIn();
    }

    async signIn() {
        const username = this.state.Username;
        const password = this.state.Password;

        try {
            const user = await Auth.signIn(username, password);
            await this.SetUser(user);
            await this.SetAuthState(AuthState.SignedIn);
            console.log("... result:", user);

        } catch (err) {
            if (err.code === "UserNotConfirmedException" ||
                err.code === "NotAuthorizedException" ||
                err.code === "UserNotFoundException"
            ) {
                this.setState({
                    Username : '',
                    Password : '',
                    error: `Login failed: ${err.code}`
                });
            } else {
                this.setState({
                    Username : '',
                    Password : '',
                    error: `An error has occurred: ${err.code}`
                });
                console.error(err);
            }
        }
    }

    showComponent (theme) {
        return (
            <div className="tc pt5">
                <h2>Sign in to your Account</h2>
                <div className="pa2">
                    <label htmlFor="username" className="pr3">UserName</label>
                    <input className="ba b--gray br2 pl2 shadow-2" type="text" placeholder="Username"
                           onChange={(e) => this.setState({Username: e.target.value})}/>
                </div>
                <div className="pa2">
                    <label htmlFor="password" className="pr3">Password</label>
                    <input className="ba b--gray br2 pl2 shadow-2" type="password" placeholder="Password"
                           onChange={(e) => this.setState({Password: e.target.value})}/>
                </div>
                <div className="pa2">
                    <a className="f6 link dim br-pill ba ph3 pv2 mb2 dib dark-green" onClick={this.handleFormSubmission}
                       href="#0">Sign In</a>
                </div>
                <div className="pa2">
                    Do not remember password ? <a className="f5 fw6 dark-green   link "
                                                  onClick={() => this.props.SetAuthState(AuthState.ForgotPassword)}
                                                  href="#0">Forgot Password</a>
                </div>
            </div>
        )
    }
}

class Header extends Component {
    constructor(props) {
        super(props);

        console.log("Header props:", props);

        const [ GetAuthState, SetAuthState, GetUser, SetUser, GetUserName, SetUserName ] = props.authFunctions;
        this.GetAuthState = GetAuthState;
        this.SetAuthState = SetAuthState;
        this.GetUser = GetUser;
        this.SetUser = SetUser;
        this.GetUserNamme = GetUserName;
        this.SetUserName = SetUserName;

        console.log("AuthState.SignedIn constant:", AuthState.SignedIn);

        // Auth.currentAuthenticatedUser()
        //     .then(async User => {
        //         console.log("(Header) Initial auth state:", User);
        //
        //         if (typeof User['userDataKey'] === "string" && typeof User[User['userDataKey']] === "string") {
        //             await this.SetAuthState(AuthState.SignedIn);
        //             // [Optional]: add shiny app content
        //             // addContentToCurrentComponent();
        //         } else {
        //             await this.SetAuthState(AuthState.SignedOut);
        //         }
        //     });
    }

    // async componentDidMount () {
    //     try {
    //         const User = await Auth.currentAuthenticatedUser();
    //         if(typeof User['userDataKey'] === "string" && typeof User[User['userDataKey']] === "string"){
    //             await this.SetAuthState(AuthState.SignedOut);
    //         } else{
    //             await this.SetAuthState(AuthState.SignedIn);
    //         }
    //     } finally {
    //         console.log("Current auth state:", this.GetAuthState());
    //     }
    // }

    render() {
        // if (GetAuthState() === AuthState.SignedIn) {
            return (
            <div>
                <div>Authenticated: {this.GetAuthState()}</div>
                {(this.GetAuthState() === AuthState.SignedIn) ?
                    <header className="App-header">
                        <h1 className="App-title">Amplify React</h1>
                        <Authenticator amplifyConfig={aws_config}/>
                    </header> :
                    <header className="App-header">
                        <h1 className="App-title">Amplify React</h1>
                        <Authenticator hide={[SignIn]} amplifyConfig={aws_config}>
                            <CustomSignIn
                                SetAuthState={this.SetAuthState}
                                SetUser={this.SetUser}
                            />
                        </Authenticator>
                    </header>
                }
            </div>
            )
        // } else {
        //     return (
        //         <div>
        //             <header className="App-header">
        //                 <h1 className="App-title">Amplify React</h1>
        //                 <Authenticator hide={[SignIn]} amplifyConfig={aws_config}>
        //                     <CustomSignIn
        //                         SetAuthState={this.SetAuthState}
        //                     />
        //                 </Authenticator>
        //             </header>
        //         </div>
        //     )
        // }
    }
}

function App ({ content }) {

    const [ authState, setAuthState ] = useState({
        status: AuthState.SignedOut,
        user: null,
        sign_up_username: '',
    });

    let [ content_loaded, setContentLoaded ] = useState(false);

    function addContentToCurrentComponent () {
        // Anything in here is fired on component mount.
        const app_container = document.getElementsByClassName("App")[0];
        const app_first_child = app_container.childNodes[0] || null;
        const app_content = (typeof content === 'function') ?
            content() :
            { childNodes: [] };
        console.log(app_first_child);
        console.log(app_content.childNodes);
        setTimeout((container) => {
            // container.append(app_content.childNodes);
            app_content.childNodes.forEach(c => {
                console.log(c);
                container.insertBefore(c, app_first_child)
            });
        }, 53, app_container);
    }

    function GetUserName () {
        return authState.sign_up_username;
    }

    function SetUserName (Val) {
        setAuthState({
            status: authState.status,
            user: authState.user,
            sign_up_username: Val
        });
    }

    function GetUser () {
        return authState.user;
    }

    function SetUser (UserVals) {
        setAuthState({
            status: authState.status,
            user: UserVals,
            sign_up_username: authState.sign_up_username
        })
    }

    function GetAuthState () {
        return authState.status;
    }

    async function SetAuthState (Val) {
        setAuthState({
            status: Val,
            user: authState.user,
            sign_up_username: authState.sign_up_username
        })
    }

    async function checkAuthenticatedUser (User) {
        Auth.currentAuthenticatedUser()
            .then(
                async user => {
                    SetUser(user);

                    if (typeof user['attributes'] === "object" && typeof user['signInUserSession'] === "object") {
                        await SetAuthState(AuthState.SignedIn);
                        if (!content_loaded) {
                            // [Optional]: add shiny app content
                            addContentToCurrentComponent();
                        } else {
                            setContentLoaded(true);
                        }
                    } else {
                        await SetAuthState(AuthState.SignedOut);
                    }

                    console.log("(App) user:", user);
                    console.log("(App) Initial auth state:", authState);
                },
                async error => {
                    await SetAuthState(AuthState.SignedOut);
                    console.log("(App) Initial auth state:", authState, error);
                }
            );

        // if (typeof user['userDataKey'] === "string" && typeof user[user['userDataKey']] === "string") {
        //     await SetAuthState(AuthState.SignedIn);
        //     if (!content_loaded) {
        //         // [Optional]: add shiny app content
        //         addContentToCurrentComponent();
        //     } else {
        //         setContentLoaded(true);
        //     }
        //     console.log("(App) Initial auth state:", authState);
        // } else {
        //     await SetAuthState(AuthState.SignedOut);
        //     console.log("(App) Initial auth state:", authState);
        // }
    }

    useEffect( () => {
        checkAuthenticatedUser(authState.user);

        if (!content_loaded) {
            console.log("Welcome to Amplify React app version:", import.meta.env.VITE_APP_VERSION, content_loaded);
            console.log("AWS Amplify React:", aws_amplify_react);
        } else {
            setContentLoaded(true);
        }

    } , []);

    if (GetAuthState() === AuthState.SignedIn) {
        return (
            <div className="App">
                <Header authFunctions={ [ GetAuthState, SetAuthState, GetUser, SetUser, GetUserName, SetUserName ] } />
                <div>
                    <a href="https://vitejs.dev" target="_blank">
                        <img src="/vite.svg" className="logo" alt="Vite logo" />
                    </a>
                    <a href="https://reactjs.org" target="_blank">
                        <img src={reactLogo} className="logo react" alt="React logo" />
                    </a>
                    <p className="read-the-docs">
                        Click on the Vite and React logos to learn more
                    </p>
                </div>
                <h1>Vite + React</h1>
                {/*<AbstractingContainersAndItems />*/}
                {/*<FillingSpace />*/}
                {/*<UnderstandingBreakpoints />*/}
                <ActionButton />
            </div>
        );
    } else {
        return (
            <div className="App">
                <Header authFunctions={ [ GetAuthState, SetAuthState, GetUser, SetUser, GetUserName, SetUserName ] } />
            </div>
        );
    }
}

export default App;
