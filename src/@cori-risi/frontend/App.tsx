import { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "@aws-amplify/auth/cognito";
import {
    Button,
    Flex,
    Heading,
    Image,
    Text,
    withAuthenticator,
    useAuthenticator,
    UseAuthenticator
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import amplifyLogo from './assets/amplify.svg';
import reactLogo from './assets/react.svg';
import reduxLogo from './assets/redux.svg';
import viteLogo from './assets/vite.svg';

import { User } from "../models/User";
import {
    decrement,
    increment,
    incrementByAmount,
    incrementByAmountAsync,
    selectCount
} from "./features/counter/counterSlice";

function App({ content, user }: { content: () => HTMLElement, user: Promise<User> }): ReactElement {

    (function init () {
        // Check access to react/vite environment variables
        console.log("Welcome to Amplify React app version:", import.meta.env.VITE_APP_VERSION);
        // console.log(aws_config);
    }());

    const allowMenuToBeClosed = true;

    const [ controlPanelOpen, setControlPanelOpen ] = useState(!allowMenuToBeClosed);

    let content_loaded = false;

    const [ windowWidth, setWidth ]   = useState<number>(0);
    const [ windowHeight, setHeight ] = useState<number>(0);
    const [ windowRatio, setRatio ] = useState<number>(0);

    const [ bid, setBid ] = useState<number>(0);

    useEffect(() => {
        if (bid > 0.0) {
            alert(`Thank you for your bid of $${bid}!`);
        }
    }, [ bid ])

    function addContentToCurrentComponent () {
        if (!content_loaded) {
            // Anything in here is fired on component mount.
            const app_container = document.getElementsByClassName("embedded-app")[0];
            if (!!app_container) {
                const app_first_child = app_container.childNodes[0] || null;
                const app_content = (typeof content === 'function') ?
                    content() :
                    { childNodes: [] };
                setTimeout((container) => {
                    // container.append(app_content.childNodes);
                    app_content.childNodes.forEach(c => {
                        container.insertBefore(c, app_first_child)
                    });
                }, 53, app_container);
                content_loaded = true;
            }
        }
    }

    useEffect( addContentToCurrentComponent , []);

    function updateWindowDimensions () {
        if (!!window &&
            window.hasOwnProperty("innerWidth") &&
            window.hasOwnProperty("innerHeight")
        ) {
            // console.log("Update width to: " + window.innerWidth)
            setWidth(window.innerWidth);
            // console.log("Update height to: " + window.innerHeight)
            setHeight(window.innerHeight);
            // console.log("Update height/width ratio to: " + window.innerHeight/window.innerWidth);
            setRatio(window.innerHeight/window.innerWidth);
            setTimeout(() => {
                console.log({windowWidth, windowHeight, windowRatio})
            });
        }
    }

    useEffect(() => {
        window.addEventListener("load", updateWindowDimensions);
        window.addEventListener("resize", updateWindowDimensions);
        return () => window.removeEventListener("resize", updateWindowDimensions);
    }, []);

    let toggleControlPanel = function() {
        if (!controlPanelOpen) {
            setControlPanelOpen(true);
            return false;
        } else {
            setControlPanelOpen(false);
            return true;
        }
    };

    return (
        <>
            <Flex direction="row"
                  justifyContent="space-between" >

                <Flex direction="column" flex={(controlPanelOpen)? "initial" : "auto"}>
                    <h1 style={{textAlign: "center"}}>Amplify + Redux + React (TS) + Vite</h1>
                    <br />
                    <Flex
                        direction={{ base: 'column', large: 'row' }}
                        justifyContent="center"
                        padding="1rem"
                        width="100%"
                    >
                        <Image
                            alt="Abstract art"
                            height="21rem"
                            objectFit="cover"
                            src="https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987"
                        />
                        <Flex direction="column"
                              justifyContent="space-between"
                              maxWidth="32rem">
                            <Heading level={3}>Abstract art</Heading>
                            <Text>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Volutpat
                                sed cras ornare arcu dui. Duis aute irure dolor in reprehenderit in
                                voluptate velit esse.
                            </Text>
                            <Counter setBid={setBid} />

                        </Flex>
                    </Flex>
                    <div className="card" style={{ textAlign: "center" }}>
                        <p>
                            Edit <code>App.tsx</code> and save to test HMR
                        </p>
                        <a href="https://docs.amplify.aws/react/tools/libraries/" target="_blank">
                            <img src={amplifyLogo} className="logo" alt="AWS Amplify" />
                        </a>
                        <a href="https://redux-toolkit.js.org/" target="_blank">
                            <img src={reduxLogo} className="logo redux" alt="Redux logo" />
                        </a>
                        <a href="https://react.dev" target="_blank">
                            <img src={reactLogo} className="logo react" alt="React logo" />
                        </a>
                        <a href="https://vitejs.dev" target="_blank">
                            <img src={viteLogo} className="logo" alt="Vite logo" />
                        </a>
                    </div>
                    <p className="read-the-docs" style={{ textAlign: "center" }}>
                        Click on the AWS Amplify, Redux, React and Vite logos to learn more
                    </p>
                </Flex>

                <ControlPanel showMenuButton={allowMenuToBeClosed} toggleCallback={toggleControlPanel}>
                    <ApplicationMenu />
                </ControlPanel>
                {/*<div className={"amplify-sign-out"}><SignOutButton /></div>*/}

            </Flex>
        </>
    );
}



function Counter (props: {
    setBid: Function
}) {
    const count = useSelector(selectCount);
    const dispatch = useDispatch();

    return (
        <div className={"row"}>
            <Button className={"button"}
                    aria-label={"Increment bid"}
                    onClick={() => (dispatch as Function)(increment())} >
                +
            </Button>
            <span className={"value"}>${count}</span>
            <Button className={"button"}
                    aria-label={"Decrement bid"}
                    onClick={() => (dispatch as Function)(decrement())} >
                -
            </Button>
            <Button
                onClick={ () => props.setBid(count) }
                variation="primary"
            >
                Bid ${count} on this item
            </Button>
        </div>
    );
}

function ApplicationMenu() {

    function showPrintOptions() {
        try {
            const print_config_form = document.getElementById("print-config")!;
            print_config_form.className = "show";
            const print_config_button = document.getElementById("print-config-btn")!;
            print_config_button.className = "amplify-button hide";
        } catch (e: unknown) {}
    }

    return (
        <div id={"application-menu"}>
            <div id={"print-exec"} className="row">
                <Button type="submit"  id={"print-config-btn"}
                        className={"amplify-button amplify-field-group__control amplify-button--primary amplify-button--fullwidth btn btn-primary btn-lg"}
                        onClick={showPrintOptions}>
                    Show print options</Button>
                {/* */}
                {/* Print config form */}
                {/* */}
                <form id={"print-config"}>
                    <fieldset id="config-fields">
                        <div>
                            <div className="col-sm-4">
                                <div className="form-group">
                                    <label>Unit</label><br />
                                    <label className="radio-inline">
                                        <input type="radio" name="unitOptions" value="in" id="inUnit" checked readOnly /> Inch
                                    </label>
                                    <label className="radio-inline">
                                        <input type="radio" name="unitOptions" value="mm" id="mmUnit" readOnly /> Millimeter
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="form-group">
                                    <label>Output format</label><br />
                                    <label className="radio-inline">
                                        <input type="radio" name="outputOptions" value="png" checked readOnly /> PNG
                                    </label>
                                    <label className="radio-inline">
                                        <input type="radio" name="outputOptions" value="pdf" readOnly /> PDF
                                    </label>
                                </div>
                            </div>
                            <div className="col-sm-5">
                                <div className="form-group">
                                    <label htmlFor="styleSelect">Map style</label>
                                    <select id="styleSelect" className="form-control">
                                        <option value="mapbox://styles/mapbox/light-v9">Mapbox Light</option>
                                        <option value="mapbox://styles/mapbox/streets-v10">Mapbox Streets</option>
                                        <option value="https://tiles.stadiamaps.com/styles/alidade_smooth.json">Stadia Maps
                                            Alidade Smooth
                                        </option>
                                        <option value="https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json">Stadia
                                            Maps Alidade Smooth Dark
                                        </option>
                                        <option value="https://tiles.stadiamaps.com/styles/outdoors.json">Stadia Maps
                                            Outdoors
                                        </option>
                                        <option value="https://tiles.stadiamaps.com/styles/osm_bright.json">Stadia Maps OSM
                                            Bright
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="col-sm-2">
                                <div className="form-group" id="widthGroup">
                                    <label htmlFor="widthInput">Width</label>
                                    <input type="text" className="form-control" id="widthInput" autoComplete="off"
                                           readOnly value="8" />
                                </div>
                            </div>
                            <div className="col-sm-2">
                                <div className="form-group" id="heightGroup">
                                    <label htmlFor="heightInput">Height</label>
                                    <input type="text" className="form-control" id="heightInput" autoComplete="off"
                                           readOnly value="6" />
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <div className="form-group" id="dpiGroup">
                                    <label htmlFor="dpiInput">DPI</label>
                                    <input type="text" className="form-control" id="dpiInput" autoComplete="off"
                                           readOnly value="300" />
                                </div>
                            </div>
                            <div className="col-sm-5">
                                <div>
                                    <div className="col-sm-4">
                                        <div className="form-group" id="latGroup">
                                            <label htmlFor="latInput">Latitude</label>
                                            <input type="text" className="form-control" id="latInput" autoComplete="off"
                                                   readOnly value="" />
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group" id="lonGroup">
                                            <label htmlFor="lonInput">Longitude</label>
                                            <input type="text" className="form-control" id="lonInput" autoComplete="off"
                                                   readOnly value="" />
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="form-group" id="zoomGroup">
                                            <label htmlFor="zoomInput">Zoom</label>
                                            <input type="text" className="form-control" id="zoomInput" autoComplete="off"
                                                   readOnly value="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>

                <button type="submit" className={"amplify-button amplify-field-group__control amplify-button--primary amplify-button--fullwidth btn btn-primary btn-lg"} id={"generate-btn"}>Print report</button>
                <div id='spinner' />
            </div>

            <a id={"data-download-link"}>
                <button type="submit" className={"amplify-button amplify-field-group__control amplify-button--primary amplify-button--fullwidth btn btn-primary btn-lg"} id={"data-download-btn"}>Download data</button>
            </a>
        </div>
    );
}

function ControlPanel (props: {
    children?: ReactElement,
    showMenuButton?: boolean | null,
    toggleCallback?: Function | null,
    signOut?: Function | null,
    user?: Promise<User> | null
}) {
    const authenticator: UseAuthenticator = useAuthenticator();
    const { signOut } = (props.hasOwnProperty("signOut") && props.signOut !== null) ? { signOut: props.signOut } : authenticator;
    const [ open, setOpen ] = useState<boolean>((props.hasOwnProperty("showMenuButton") && props.showMenuButton !== null) ? !props.showMenuButton : false);
    const toggle: Function = (props.hasOwnProperty("toggleCallback") && !!props.toggleCallback && props.toggleCallback !== null) ? props.toggleCallback : () => true;
    const [ userState, setUserState ] = useState<User | null>(null);
    const user: Promise<User> = (props.hasOwnProperty("user") && !!props.user && props.user !== null) ?  Promise.resolve(props.user) : getCurrentUser();

    user.then(u => {
        if (userState === null) {
            console.log("AWS cognito user:", u);
            setUserState(u);
        }
    });

    function getUserLabel (u: User) {
        return (u.hasOwnProperty("signInUserSession")
            && !!u.signInUserSession
            && u.signInUserSession.hasOwnProperty("idToken")
            && u.signInUserSession?.idToken.hasOwnProperty("payload")
        ) ? (
                (u.signInUserSession?.idToken.payload.hasOwnProperty("name") && !!u.signInUserSession?.idToken.payload.name) ?
                    u.signInUserSession?.idToken.payload.name :
                    (u.signInUserSession?.idToken.payload.hasOwnProperty("email") && !!u.signInUserSession?.idToken.payload.email) ?
                        u.signInUserSession?.idToken.payload.email :
                        u.username
            ) :
            (u.hasOwnProperty("email") && !!u.email) ?
                u.email :
                u.username
    }
    
    return (
        <div className={open ? "control-panel": "control-panel closed"}>

            {(props.hasOwnProperty("showMenuButton") && props.showMenuButton !== null && !props.showMenuButton) ? (
                <div style={{ display: "none" }} />
            ): (

                <div className="menu-toggle col">
                    <a className="menu-toggle__control js-menu-control js-open-main-menu" role="button" >
                    <span id="mm-label" className="hamburger-control__label">
                      <span className="hamburger-control__open-label" aria-hidden={ (!open) } style={{ display: open ? "none" : "block" }} >
                        <span className="screen-reader-text">Site Menu</span>
                      </span>
                      <span className="hamburger-control__close-label" aria-hidden={ open }>
                        <span className="screen-reader-text"
                              onClick={() => { setOpen(!open); return !!toggle() }}>Close Menu</span>
                      </span>
                    </span>
                        <span className="hamburger-control" aria-hidden={ !open }>
                        <span className="hamburger-control__inner"/>
                        <span className="hamburger-control__inner"/>
                        <span className="hamburger-control__open" aria-hidden={ !open }
                              onClick={() => { setOpen(!open); return !!toggle() }}
                              style={{ display: open ? "none" : "block"  }} >
                            <svg className="menu" width="20" height="18" viewBox="0 0 20 18" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g fill="#16343e">
                                    <rect y=".5" width="20" height="3" rx="1.5" />
                                    <rect y="7.5" width="20" height="3" rx="1.5" />
                                    <rect y="14.5" width="20" height="3" rx="1.5" />
                                </g><defs><clipPath id="clip0">
                                <path fill="#fff" transform="translate(0 .5)"
                                      d="M0 0h20v17H0z"/></clipPath></defs>
                            </svg>
                        </span>
                        <span className="hamburger-control__close" aria-hidden={ open }
                              onClick={() => { setOpen(!open); return toggle() }}
                              style={{ display: open ? "block" : "none"  }} >
                            <svg className="menu-close" width="22" height="22" viewBox="0 0 22 22" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M3.304 20.801L11 13.104l7.698 7.697c.296.297.671.449 1.052.449.38 0 .756-.152 1.052-.449a1.459 1.459 0 000-2.104L13.104 11 20.8 3.303a1.459 1.459 0 000-2.104 1.46 1.46 0 00-2.104 0h0L11 8.898 3.301 1.2a1.46 1.46 0 00-2.103 0h0a1.46 1.46 0 000 2.104L8.834 11 1.2 18.697s0 0 0 0a1.458 1.458 0 00-.012 2.092c.255.326.713.461 1.064.461.38 0 .756-.152 1.052-.449h0z"
                                    fill="{!!light_on_dark ? '#fffff9' : '#16343e'}" stroke="#16343e"
                                />
                            </svg>
                        </span>
                    </span>
                    </a>
                </div>
            )}
            
            <div className={open ? "controls open": "controls"}
                 style={open ? {
                     maxWidth: "min-content",
                     paddingLeft: "56px",
                     paddingRight: "56px",
                     overflow: "scroll"
                 } : {
                     maxWidth: "0px",
                     padding: "0px",
                     overflow: "hidden"
                 }}>
                
                {(userState !== null) ? (
                    <h5>{ getUserLabel(userState)}</h5>
                ) : (
                    <div style={{ display: "none" }} />
                )}
                
                <p id="info">&nbsp;</p>

                { props.children }
                
                <div id={"auth-control"} className="row show">
                    {(signOut !== null && typeof signOut === "function") ? (
                        // <button id={"sign-out"} className={"amplify-button amplify-field-group__control amplify-button--primary amplify-button--fullwidth btn btn-primary btn-lg"} onClick={() => { autoSignIn(); signOut(); }}>Sign out</button>
                        <SignOutButton signOut={signOut} />
                    ) : (
                        <button>No Auth Controls</button>
                    )}
                </div>
            
            </div>
        </div>
    );
}

function SignOutButton ({ signOut }: { signOut: Function }) {
    return <Button className={"amplify-sign-out"} title="Sign Out" onClick={() => { signOut(); }}>Sign Out</Button>;
}

// export default App;
export default withAuthenticator(App, {
    loginMechanisms: ['username']
});
