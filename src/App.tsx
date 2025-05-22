import * as React from "react";
import {useContext, useState} from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { getUrl, uploadData } from 'aws-amplify/storage';
import { StorageImage } from "@aws-amplify/ui-react-storage";

import { ApiContext} from "@cori-risi/cori.data.api";

import "@cori-risi/cori.data.api/inst/dist/cori.data.api.css";

import "./App.css";
// import style from "./App.module.css";

const theme = createTheme({
    typography: {
        fontFamily: 'Montserrat',
    },
    palette: {
        primary: {
            main: '#00835D',
            light: '#A3E2B5',
            dark: '#26535C',
            contrastText: 'white',
        },
    },
});

export default function App (props: { user: any }) {

    console.log("Re-rendering App component for ", props.user);

    const apiContext = useContext(ApiContext);

    const [ file, setFile ] = useState<File | null>(null);

    const [ testPath, setTestPath ] = useState<string>("tests/pictures/john.jpg");
    const [ testUrl, setTestURL ] = useState<string>("");

    const handleChange = (event: any) => {
        console.log(event.target.files);

        setFile(event.target.files?.[0]);
    };

    const handleClick = async () => {
        console.log(file);

        if (!!file && "name" in file) {

            const filePath = `tests/pictures/${file.name.toString()}`;

            await uploadData({
                // path: `tests/pictures/${file.name}`,
                path: filePath,
                data: file,
            })

            setTimeout(() => {

                getUrl({
                    path: filePath
                    // Alternatively, path: ({identityId}) => `album/${identityId}/1.jpg`
                })
                    .then((linkToStorageFile) => {
                        console.log('signed URL: ', linkToStorageFile.url);
                        console.log('URL expires at: ', linkToStorageFile.expiresAt);

                        apiContext?.apiClient?.get("" + linkToStorageFile.url.toString())
                            .then((data) => {
                                console.log(data);
                            });

                        setTestURL(linkToStorageFile.url.toString());
                    });

                setTestPath(filePath);

            }, 1533);
        } else {
            return;
        }
    };

    return (
        <ThemeProvider theme={theme}>

            <div>
                <h3>Amplify / React Frontend application template</h3>
                {(testUrl !== "") ? (
                    <img alt="Test URL" src={testUrl} />
                ) : (
                    <StorageImage alt="Test Path" path={testPath} />
                )}
                <br />
                Choose an image to upload: <br />
                <input type="file" onChange={handleChange} />
                <button onClick={handleClick}>Upload</button>
                <br /><br /><br />
            </div>

        </ThemeProvider>
    );
}
