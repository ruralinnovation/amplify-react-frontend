import '@aws-amplify/ui-react/styles.css';
import './App.css';
import './components/Header.css';
import reactLogo from './assets/react.svg';

import { Component, Fragment, useEffect, useState } from 'react';
import ActionButton from './components/ActionButton';
import AbstractingContainersAndItems from "./components/material-ui/AbstractingContainersAndItems";
import FillingSpace from "./components/material-ui/FillingSpace";
import UnderstandingBreakpoints from "./components/material-ui/UnderstandingBreakpoints";

import aws_config from "./aws-config";
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
        this.SetAuthenticatedUser = props.SetAuthenticatedUser;
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
            console.log("Sign-in user:", user);
            this.SetAuthenticatedUser(user, AuthState.SignedIn)
                .then(async () => {
                    console.log("... result:", user);
                    super.changeState("signOut");
                });

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
                                                  onClick={() => this.SetAuthenticatedUser(null, AuthState.ForgotPassword)}
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
        this.SetAuthenticatedUser = props.SetAuthenticatedUser;
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


        await this.SetAuthenticatedUser(null, AuthState.SignedOut);
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

        // const [ authState, setAuthState ] = props.authState;
        this.getAuthState = () => this.props.authState[0];
        this.setAuthState = (values) => this.props.authState[1](values);

        this.GetAuthStatus = () => {
            setTimeout(() => console.log("GetAuthStatus:", this.props.authState[0]));
            return this.getAuthState().status;
        };

        this.GetUser = () => {
            return this.getAuthState().user;
        };

        this.SetAuthenticatedUser = async (User, Val) => {
            console.log("SetAuthenticatedUser:", User);
            return await this.setAuthState({
                status: Val,
                user: User,
                sign_up_username: (User !== null &&typeof User['username'] === "string") ?
                    User['username'] :
                    this.GetUserName()
            })
        };

        this.GetUserName = () => {
            return this.getAuthState().sign_up_username;
        };

        this.SetUserName = async (Val) => {
            return await this.setAuthState({
                status: this.GetAuthStatus(),
                user: this.GetUser(),
                sign_up_username: Val
            });
        };
    }

    async checkAuthenticatedUser () {
        Auth.currentAuthenticatedUser()
            .then(
                async user => {

                    if (typeof user['attributes'] === "object" && typeof user['signInUserSession'] === "object") {
                        await this.SetAuthenticatedUser(user, AuthState.SignedIn);

                        console.log("(Header) user:", user);
                        console.log("(Header) Initial auth state:", this.getAuthState());
                    } else {
                        console.log("ERROR");
                        await this.SetAuthenticatedUser(null, AuthState.SignedOut);
                    }
                },
                async error => {
                    console.log("ERROR");
                    await this.SetAuthenticatedUser(null, AuthState.SignedOut);
                    console.log("(Header) Initial auth state:", this.getAuthState(), error);
                }
            );
    }

    async componentDidMount () {
        try {
            await this.checkAuthenticatedUser();
        } finally {
            console.log("Current auth state:", this.GetAuthStatus());
        }
    }

    render() {
            return (
            <div>
                <div>Authenticated: {(this.GetAuthStatus() == AuthState.SignedIn)? this.GetAuthStatus() + " as " + this.GetUserName() : this.GetAuthStatus() }</div>
                    <header className="App-header">
                        <h1 className="App-title">Amplify React</h1>
                        <Authenticator hide={[ SignIn ]} amplifyConfig={aws_config}>
                            <CustomSignIn SetAuthenticatedUser={this.SetAuthenticatedUser} />
                            <CustomSignOut SetAuthenticatedUser={this.SetAuthenticatedUser} />
                        </Authenticator>
                    </header>
                {/*}*/}
            </div>
            )
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

            if (getAuthState().status === AuthState.SignedIn) {
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
                    <Fragment>
                        {/*<div>Authenticated: {getAuthState().status}</div>*/}
                        <Header authState={[ authState, setAuthState ]} />
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
                        <ActionButton/>
                        <AbstractingContainersAndItems />
                        <FillingSpace />
                        <UnderstandingBreakpoints />
                    </Fragment> :
                    <Fragment>
                        {/*<div>Authenticated: {getAuthState().status}</div>*/}
                        <Header authState={[ authState, setAuthState ]} />
                    </Fragment>
                }
            </div>
        );

}

export default App;
