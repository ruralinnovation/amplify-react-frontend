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
    constructor (props) {
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
        await this.signIn();
    }

    async signIn() {
        const username = this.state.Username;
        const password = this.state.Password;

        console.log("Attempting to sign-in ...");

        try {
            const user = await Auth.signIn(username, password);
            await this.SetUser(user);
            await this.SetAuthState(AuthState.SignedIn);
            console.log("... result:", user);

            super.changeState("signOut")

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
            <div className="custom-auth tc pt5">
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
                                                  onClick={() => this.SetAuthState(AuthState.ForgotPassword)}
                                                  href="#0">Forgot Password</a>
                </div>
            </div>
        )
    }
}

export class CustomSignOut extends SignOut {
    constructor (props) {
        super(props);

        this.signOut = this.signOut.bind(this);
        this.handleFormSubmission = this.handleFormSubmission.bind(this);
        this.SetAuthState = props.SetAuthState;
        this.SetUser = props.SetUser;
    }

    async handleFormSubmission(evt) {
        evt.preventDefault();
        await this.signOut();
    }

    async signOut() {
        console.log("Attempting to sign-out ...");

        Auth.signOut({ global: true })
            .then(
                () => {},
                err => {
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
            );


        await this.SetAuthState(AuthState.SignedOut);
        await this.SetUser(null);
    }

    showComponent (theme) {
        return (
            <div className="custom-auth custom-sign-out tc pt5"></div>
        )
    }
}

class Header extends Component {
    constructor(props) {
        super(props);

        this.authState = props.authState;

        // const [ getAuthState, setAuthState ] = props.authFunctions;
        // this.getAuthState = props.authFunctions[0];
        // this.setAuthState = props.authFunctions[1];

        this.GetUserName = () => {
            return this.props.authFunctions[0]().sign_up_username;
        };

        this.SetUserName = (Val) => {
            this.props.authFunctions[1]({
                status: this.props.authFunctions[0]().status,
                user: this.props.authFunctions[0]().user,
                sign_up_username: Val
            });
        };

        this.GetUser = () => {
            return this.props.authFunctions[0]().user;
        }

        this.SetUser = (UserVals) => {
            this.props.authFunctions[1]({
                status: this.props.authFunctions[0]().status,
                user: UserVals,
                sign_up_username: this.props.authFunctions[0]().sign_up_username
            })
        }

        this.GetAuthState = () => {
            return this.props.authFunctions[0]().status;
        }

        this.SetAuthState = (Val) => {
            this.props.authFunctions[1]({
                status: Val,
                user: this.props.authFunctions[0]().user,
                sign_up_username: this.props.authFunctions[0]().sign_up_username
            })
        }
    }

    async checkAuthenticatedUser (User) {
        Auth.currentAuthenticatedUser()
            .then(
                async user => {
                    this.SetUser(user);

                    if (typeof user['attributes'] === "object" && typeof user['signInUserSession'] === "object") {
                        await this.SetAuthState(AuthState.SignedIn);

                        console.log("(Header) user:", user);
                        console.log("(Header) Initial auth state:", this.authState);
                    } else {
                        await this.SetAuthState(AuthState.SignedOut);
                    }
                },
                async error => {
                    await this.SetAuthState(AuthState.SignedOut);
                    console.log("(Header) Initial auth state:", this.authState, error);
                }
            );
    }

    async componentDidMount () {
        try {
            await this.checkAuthenticatedUser();
        } finally {
            console.log("Current auth state:", this.authState);
        }
    }

    render() {
        // if (GetAuthState() === AuthState.SignedIn) {
            return (
            <div>
                <div>Authenticated: {this.GetAuthState()}</div>
                {/*{(this.GetAuthState() === AuthState.SignedIn) ?*/}
                {/*    <header className="App-header">*/}
                {/*        <h1 className="App-title">Amplify React</h1>*/}
                {/*        <Authenticator amplifyConfig={aws_config}>*/}
                {/*            <CustomSignOut*/}
                {/*                SetAuthState={this.SetAuthState}*/}
                {/*                SetUser={this.SetUser}*/}
                {/*            />*/}
                {/*        </Authenticator>*/}
                {/*    </header> :*/}
                    <header className="App-header">
                        <h1 className="App-title">Amplify React</h1>
                        <Authenticator hide={[ SignIn ]} amplifyConfig={aws_config}>
                            <CustomSignIn
                                SetAuthState={this.SetAuthState}
                                SetUser={this.SetUser}
                            />
                            <CustomSignOut
                                SetAuthState={this.SetAuthState}
                                SetUser={this.SetUser}
                            />
                        </Authenticator>
                    </header>
                {/*}*/}
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

    function getAuthState () {
        return authState;
    }

    useEffect( () => {

        if (!content_loaded) {
            console.log("Welcome to Amplify React app version:", import.meta.env.VITE_APP_VERSION, content_loaded);
            console.log("AWS Amplify React:", aws_amplify_react);

            if (!content_loaded && getAuthState().status === AuthState.SignedIn) {
                // [Optional]: add shiny app content
                addContentToCurrentComponent();
            } else {
                setContentLoaded(true);
            }
        }

    } , []);

        return (
            <div className="App">
                {(getAuthState().status === AuthState.SignedIn) ?
                    <div>Authenticated: {authState.status}<br/>
                        <Header
                            authFunctions={[ getAuthState, setAuthState ]}
                            authState={authState} />
                        <div>
                            <a href="https://vitejs.dev" target="_blank">
                                <img src="/vite.svg" className="logo" alt="Vite logo"/>
                            </a>
                            <a href="https://reactjs.org" target="_blank">
                                <img src={reactLogo} className="logo react" alt="React logo"/>
                            </a>
                            <p className="read-the-docs">
                                Click on the Vite and React logos to learn more
                            </p>
                        </div>
                        <h1>Vite + React</h1>
                        {/*<AbstractingContainersAndItems />*/}
                        {/*<FillingSpace />*/}
                        {/*<UnderstandingBreakpoints />*/}
                        <ActionButton/>
                    </div> :
                    <div>Authenticated: {authState.status}<br/>
                        <Header
                            authFunctions={[ getAuthState, setAuthState ]}
                            authState={authState} />
                    </div>
                }
            </div>
        );

}

export default App;
