import * as React from "react";

export default function Sidebar() {
    return (
        <div id="sidebar">

            <div id="about" className="modal-content prose max-w-none row">
                <div style={{"overflowY": "scroll"}}>
                    <b>About the Tool</b>
                    <br />
                    <br />
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Volutpat
                        sed cras ornare arcu dui. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse.
                        <a href="" target="_blank">
                            Link to document</a>. </p>
                    <br />
                    <br />
                </div>
            </div>

        </div>
    );
}