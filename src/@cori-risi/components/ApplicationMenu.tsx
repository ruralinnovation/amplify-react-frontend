import {Button, Card} from "@aws-amplify/ui-react";
import "./styles/ApplicationMenu.scss";
import {useState} from "react";
import { MDAPrinter } from "./MDAPrinter";
import { MDADownloader } from "./MDADownloader";


function ApplicationMenu () {

    // const userState: User = useSelector(selectUser);

    return (
        <Card id={"application-menu"} style={{ minWidth: "254px" }}>

            <h4>MDA (Map & Data Analysis) Options</h4>

            <br />

            <MDADownloader />

            <MDAPrinter />

        </Card>
    );
}

export default ApplicationMenu;
