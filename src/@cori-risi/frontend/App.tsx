import { useEffect, useState } from 'react';
import {
    Button,
    Flex,
    Heading,
    Image,
    Text,
    withAuthenticator,
    useAuthenticator
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import './App.css';

function SignOutButton() {
    const { signOut } = useAuthenticator();
    return <Button title="Sign Out" onClick={signOut}>Sign Out</Button>;
}

function App({ content }: { content: () => HTMLElement }): JSX.Element {
    let content_loaded = false;

    const [windowWidth, setWidth]   = useState(0);
    const [windowHeight, setHeight] = useState(0);
    const [windowRatio, setRatio] = useState(0);
    
    const [count, setCount] = useState(0);
    
    function updateCartBy (quantity: number) {
        setCount(count + quantity);
        alert('Added item to cart!')
        return count;
    }
    
    function addContentToCurrentComponent () {
        if (!content_loaded) {
            // Anything in here is fired on component mount.
            const app_container = document.getElementsByClassName("embedded-app")[0];
            if (!!app_container) {
                const app_first_child = app_container.childNodes[0] || null;
                const app_content = (typeof content === 'function') ?
                    content() :
                    { childNodes: [] };
                // console.logapp_first_child);
                // console.logapp_content.childNodes);
                setTimeout((container) => {
                    // container.append(app_content.childNodes);
                    app_content.childNodes.forEach(c => {
                        // console.logc);
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
    
    (function init () {
        // Check access to react/vite environment variables
        // console.log("Welcome to Amplify React app version:", import.meta.env.VITE_APP_VERSION);
        // console.log(aws_config);
    }())

  return (
      <>
          <div className={"amplify-sign-out"}><SignOutButton /></div>
          <h1 style={{textAlign: "center"}}>Vite + React + TS</h1>
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
                  <Button
                      variation="primary"
                      onClick={() =>  updateCartBy(1)}
                  >
                      Add to Cart {count}
                  </Button>

              </Flex>
          </Flex>
          <div className="card" style={{textAlign: "center"}}>
              <p>
                  Edit <code>src/App.tsx</code> and save to test HMR
              </p>
              <a href="https://vitejs.dev" target="_blank">
                  <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                  <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
          </div>
          <p className="read-the-docs" style={{textAlign: "center"}}>
              Click on the Vite and React logos to learn more
          </p>
      </>
  )
}

// export default App;
export default withAuthenticator(App, {
    loginMechanisms: ['username']
});
