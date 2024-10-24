import * as React from "react";

export default function Sidebar() {
    return (
        <div id="sidebar">

            <div id="about" className="modal-content prose max-w-none row">
                <div style={{"overflowY": "scroll"}}>
                    <b style={{ "position": "relative", "display": "block" }}>About the Tool</b>
                    <br style={{ "position": "relative", "display": "block" }} />
                    <br style={{ "position": "relative", "display": "block" }} />
                    <p style={{ "position": "relative", "display": "block" }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Volutpat
                        sed cras ornare arcu dui. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse.
                        <br style={{ "position": "relative", "display": "block" }} />
                        <a href="" target="_blank">
                            Link to document</a>.
                    </p>
                    <br style={{ "position": "relative", "display": "block" }} />
                </div>
            </div>

        </div>
    );
}