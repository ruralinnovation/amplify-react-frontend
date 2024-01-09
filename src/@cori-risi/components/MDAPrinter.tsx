import { Button } from "@aws-amplify/ui-react";
import { useState } from "react";
import { LngLat, Map, MapRef } from "react-map-gl";

export function MDAPrinter (props: {}) {

    /*
     * High-res map rendering
     * based on ...
     *
     * mpetroff/print-maps
     * https://github.com/mpetroff/print-maps
     *
     * -----LICENSE------
     * Print Maps - High-resolution maps in the browser, for printing
     * Copyright (c) 2015-2020 Matthew Petroff
     *
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     *
     * The above copyright notice and this permission notice shall be included in
     * all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     * THE SOFTWARE.
     */

    //
    // Print form
    //

    type PrintForm = {
        [index: string]: {
            value?: string
        } | [{
            checked?: string,
        }],
        latInput: {
            value: string
        },
        lonInput: {
            value: string
        },
        zoomInput: {
            value: string
        },
        widthInput: {
            value: string
        },
        heightInput: {
            value: string
        },
        dpiInput: {
            value: string
        },
        styleSelect: {
            value: string
        },
        outputOptions: [{
            checked: string
        }],
        unitOptions: [{
            checked: string
        }]
    };

    //
    // Inputs
    //

    type Inputs = {
        [index: string]: number | string,
        // longitude: number,
        // latitude: number,
        // zoom: number,
        width: string,
        height: string,
        dpi: string,
        // format: string,
        // unit: string,
        // style: string,
    };
    const [ inputs, setInputs ] = useState<Inputs>({
        longitude: 0, /* read-only */
        latitude: 0, /* read-only */
        zoom: 0, /* read-only */
        width: "8",
        height: "6",
        dpi: "300",
        format: "png", /* hidden */
        unit: "in", /* hidden */
        style: "mapbox://styles/ruralinno/clhgnms6802i701qn0c9y0pow",
    });

    //
    // Errors
    //

    // const errors: Errors = {
    //     width: {
    //         state: false,
    //         msg: 'Width must be a positive number!',
    //         grp: 'widthGroup'
    //     },
    //     height: {
    //         state: false,
    //         grp: 'heightGroup'
    //     },
    //     dpi: {
    //         state: false,
    //         msg: 'DPI must be a positive number!',
    //         grp: 'dpiGroup'
    //     }
    // };

    type ErrorState = {
        state: boolean,
        msg: string,
        grp: string
    };
    type InputErrors = {
        [input: string]: ErrorState,
        width: ErrorState,
        height: ErrorState,
        dpi: ErrorState
    };
    type Errors = Partial<Record<keyof InputErrors, ErrorState>>;
    const [ errors, setErrors ] = useState<Errors>(validate(inputs));
    // const errors: Errors ={
    //     width:  {
    //         state: false,
    //         msg: 'Width must be a positive number!',
    //         grp: 'widthGroup'
    //     },
    //     height: {
    //         state: false,
    //         msg: 'Height must be a positive number!',
    //         grp: 'heightGroup'
    //     },
    //     dpi: {
    //         state: false,
    //         msg: 'DPI must be a positive number!',
    //         grp: 'dpiGroup'
    //     }
    // };

    function isError(inputName?: string): boolean {
        'use strict';

        if (!!inputName && errors.hasOwnProperty(inputName)) {
            return !!(errors[inputName] && !!errors[inputName]!.state! && touched[inputName]!);
        } else for (let e in errors) {
            if (!!e && errors.hasOwnProperty(e) && !!errors[e]!.state! && touched[e]!) {
                return true;
            }
        }
        return false;
    }

    function errorMessage(inputName: string) {
        return (
            <p className={"form-error"}>{ errors[inputName]!.msg! }</p>
        );
    }

    //
    // Validate "touched" inputs
    //

    type Touched = Partial<Record<keyof Inputs, boolean>>;
    const [ touched, setTouched ] = useState<Touched>({});

    function validate (newInputs: Inputs): Errors {
        const newErrors: Errors = {};

        newErrors.width = {
            state: (parseInt(newInputs.width) !== parseInt(newInputs.width)
                || parseInt(newInputs.width) < 0
            ),
            msg: 'Width must be a positive number!',
            grp: 'widthGroup'
        };

        newErrors.height = {
            state: (parseInt(newInputs.height) !== parseInt(newInputs.height)
                || parseInt(newInputs.height) < 0
            ),
            msg: 'Height must be a positive number!',
            grp: 'heightGroup'
        };

        newErrors.dpi = {
            state: (parseInt(newInputs.dpi) !== parseInt(newInputs.dpi)
                || parseInt(newInputs.dpi) < 0
            ),
            msg: 'DPI must be a positive number!',
            grp: 'dpiGroup'
        };

        console.log("Errors: ", newErrors);

        return newErrors;
    }

    function createMapImage(
        element_id: string, map: MapRef, width: number, height: number, dpi: number,
        format: string, unit: string, style: string, zoom: number, center: LngLat, bearing: number, pitch: number
    ) {
        'use strict';

        // Calculate pixel ratio
        const actualPixelRatio = window.devicePixelRatio;
        Object.defineProperty(window, 'devicePixelRatio', {
            get: function() {return dpi / 96}
        });

        // Create map container
        const hidden = document.createElement('div');
        hidden.className = 'hidden-map';
        document.body.appendChild(hidden);
        const container = document.createElement('div');
        container.style.width = toPixels(width);
        container.style.height = toPixels(height);
        hidden.appendChild(container);

        map.getCanvas().toBlob(function(blob) {

            const map_element: HTMLElement | null = document.getElementById(element_id) as HTMLElement;
            const map_container: HTMLElement | null = document.getElementsByClassName("mapboxgl-canvas-container")[0] as HTMLElement;

            if (blob !== null && map_element !== null && map_container !== null) {

                const url = URL.createObjectURL(blob);

                const newImg = document.createElement("img");

                newImg.id = "image";

                // console.log(newImg.src);

                if (!!newImg.src) {

                    newImg.src = url;

                } else {

                    newImg.onload = () => {

                        // window.saveAs(blob, 'map.png');

                        // no longer need to read the blob so it's revoked
                        URL.revokeObjectURL(url);
                    };
                    (newImg as any).style = "width: 100%;"

                    newImg.src = url;
                }

                map_element.prepend(newImg);

                (map_container as any).style = "display:none";
                window.addEventListener("afterprint", (event) => {
                    console.log("After print");
                    (map_container as any).style = "display: block";
                    newImg.remove();
                });

                setTimeout(print, 253);

            }
        });
    }

    //
    // Generate printable map rendering
    //

    function generatePrintMap (element_id: string, map: MapRef) {

        if (isError() === true) {
            console.error('The current configuration is invalid! Please ' +
                'correct the errors and try again.');
            return;
        }

        const center: LngLat = map.getCenter();
        const longitude: number = center.lng;
        const latitude: number = center.lat;
        const zoom: number = map.getZoom();
        const bearing: number = map.getBearing();
        const pitch: number = map.getPitch();

        const form: PrintForm = (document.getElementById('print-config') as unknown) as PrintForm;

        form.lonInput.value = longitude.toString();
        form.latInput.value = latitude.toString();
        form.zoomInput.value = zoom.toString();

        const width: number = Number(form.widthInput.value);
        const height: number = Number(form.heightInput.value);
        const dpi: number = Number(form.dpiInput.value);
        const format: string = form.outputOptions[0].checked ? 'png' : 'pdf';
        const unit: string = form.unitOptions[0].checked ? 'in' : 'mm';
        const style: string = form.styleSelect.value;

        const printHandler = () => {
            createMapImage(element_id, map, width, height, dpi, format, unit, style, zoom, center, bearing, pitch);
            map.off('idle', printHandler);
        };

        map.on('idle', printHandler);

        map.flyTo({ // flyTo is a shortcut for zoomTo + panTo
            center: center,
            zoom: zoom
        });
    }

    //
    // Helper function
    //

    function toPixels(length: number) {
        'use strict';

        const form: PrintForm = (document.getElementById('print-config') as unknown) as PrintForm;
        const unit = form.unitOptions[0].checked ? 'in' : 'mm';
        let conversionFactor = 96;
        if (unit == 'mm') {
            conversionFactor /= 25.4;
        }

        return conversionFactor * length + 'px';
    }

    function showPrintOptions (element_id: string, map: MapRef) {

        try {
            const print_config_form = document.getElementById("print-config")!;
            print_config_form.className = "show";

            //
            // Initialize map => form update
            //

            function updateFormValues () {
                const center: LngLat = map.getCenter();
                const longitude: number = center.lng;
                const latitude: number = center.lat;
                const zoom: number = map.getZoom();
                const bearing: number = map.getBearing();
                const pitch: number = map.getPitch();

                const form: PrintForm = (print_config_form as unknown) as PrintForm;

                form.lonInput.value = longitude.toString();
                form.latInput.value = latitude.toString();
                form.zoomInput.value = zoom.toString();
                const style: string = form.styleSelect.value;
            }

            map.on('boxzoomend', (e) => {
                console.log('event type:', e.type);
                updateFormValues();
            });

            map.on('click', (e) => {
                console.log('event type:', e.type);
                updateFormValues();
            });

            map.on('mouseup', (e) => {
                console.log('event type:', e.type);
                updateFormValues();
            });

            map.on('touchend', (e) => {
                console.log('event type:', e.type);
                updateFormValues();
            });

            map.on('wheel', (e) => {
                console.log('event type:', e.type);
                updateFormValues();
            });

            updateFormValues();


            //
            // Update map style from form selector
            //
            if (print_config_form.hasOwnProperty("styleSelect")) {

                const print_map_style_selector: HTMLOptionElement = (print_config_form as { [key: string]: any })["styleSelect"] as HTMLOptionElement;

                print_map_style_selector.addEventListener('change', (e) => {
                    (map as any).setStyle!(print_map_style_selector.value);
                });
            }

            const print_config_button = document.getElementById("print-config-btn")!;
            print_config_button.className = "amplify-button hide";

        } catch (e: unknown) {}
    }

    return (
        <div id={"print-exec"} className="row">
            <Button type="submit"  id={"print-config-btn"}
                    className={"amplify-button amplify-field-group__control amplify-button--primary amplify-button--fullwidth btn btn-primary btn-lg"}
                    onClick={() => (window.hasOwnProperty("map")) ?
                        showPrintOptions("map", (window as { [key: string]: any })["map"] as MapRef) :
                        window.alert('This app does not have a "map" object in global scope')
                    }>
                Show print options
            </Button>

            {/* Print config form */}

            <form id={"print-config"}>
                <fieldset id="config-fields">
                    <div style={{ display: "none" }}>
                        <br/>
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label className={"form-label"}>Unit: </label>{/*<br />*/}
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
                                <label className={"form-label"}>Output: </label>{/*<br />*/}
                                <label className="radio-inline">
                                    <input type="radio" name="outputOptions" value="png" checked readOnly /> PNG
                                </label>
                                <label className="radio-inline">
                                    <input type="radio" name="outputOptions" value="pdf" readOnly /> PDF
                                </label>
                            </div>
                        </div>
                    </div>

                    <br />

                    <div className="col-sm-5">
                        <div className={"form-group"}>
                            <label className={"form-label"} htmlFor="styleSelect">Map style</label>
                            <select id="styleSelect" className="form-control">
                                <option value="mapbox://styles/ruralinno/clhgnms6802i701qn0c9y0pow">CORI/RISI Assessment Map</option>
                                <option value="mapbox://styles/ruralinno/cjyhquqe607y91cmjkhg30fa4">CORI Light Map</option>
                                <option value="mapbox://styles/ruralinno/ck8gnm7b70eo21jp29fvcq1k1">CORI Monochrome Map</option>
                                <option value="mapbox://styles/ruralinno/ckmxgvwii0tn317o6nt0reg27">CORI Satellite Fade/Zoom</option>
                                <option value="mapbox://styles/mapbox/light-v9">Mapbox Light</option>
                                <option value="mapbox://styles/mapbox/streets-v10">Mapbox Streets</option>
                                {/*<option value="https://tiles.stadiamaps.com/styles/alidade_smooth.json">Stadia Maps Alidade Smooth</option>*/}
                                {/*<option value="https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json">Stadia Maps Alidade Smooth Dark</option>*/}
                                {/*<option value="https://tiles.stadiamaps.com/styles/outdoors.json">Stadia Maps Outdoors</option>*/}
                                {/*<option value="https://tiles.stadiamaps.com/styles/osm_bright.json">Stadia Maps OSM Bright</option>*/}
                            </select>
                        </div>
                        <div className={"form-group"}>
                            <div className="col-sm-4">
                                <div className="form-group" id="latGroup">
                                    <label className={"form-label"} htmlFor="latInput">Latitude</label>
                                    <input type="text" className="form-control" id="latInput" autoComplete="off"
                                           readOnly value="" />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-group" id="lonGroup">
                                    <label className={"form-label"} htmlFor="lonInput">Longitude</label>
                                    <input type="text" className="form-control" id="lonInput" autoComplete="off"
                                           readOnly value="" />
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="form-group" id="zoomGroup">
                                    <label className={"form-label"} htmlFor="zoomInput">Zoom</label>
                                    <input type="text" className="form-control" id="zoomInput" autoComplete="off"
                                           readOnly value="" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="col-sm-4">
                            <div className="form-group" id="widthGroup">
                                <label className={"form-label"} htmlFor="widthInput">Width (inches)</label>
                                <input type="text" className="form-control" id="widthInput" autoComplete="off"
                                       minLength={1} maxLength={2}
                                       onBlur={ (event) => {
                                           setTouched({ ...touched, width: true })
                                       }}
                                       onChange={event => {
                                           setInputs({ ...inputs, width: event.target.value })
                                           setErrors(
                                               validate({ ...inputs, width: event.target.value })
                                           )
                                       }}
                                       value={inputs.width} />
                                { isError("width") && errorMessage("width") }
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group" id="heightGroup">
                                <label className={"form-label"} htmlFor="heightInput">Height (inches)</label>
                                <input type="text" className="form-control" id="heightInput" autoComplete="off"
                                       minLength={1} maxLength={2}
                                       onBlur={ (event) => {
                                           setTouched({ ...touched, height: true })
                                       }}
                                       onChange={event => {
                                           setInputs({ ...inputs, height: event.target.value })
                                           setErrors(
                                               validate({ ...inputs, height: event.target.value })
                                           )
                                       }}
                                       value={inputs.height} />
                                { isError("height") && errorMessage("height") }
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group" id="dpiGroup">
                                <label className={"form-label"} htmlFor="dpiInput">DPI</label>
                                <input type="text" className="form-control" id="dpiInput" autoComplete="off"
                                       minLength={2} maxLength={3}
                                       onBlur={ (event) => {
                                           setTouched({ ...touched, dpi: true })
                                       }}
                                       onChange={event => {
                                           setInputs({ ...inputs, dpi: event.target.value })
                                           setErrors(
                                               validate({ ...inputs, dpi: event.target.value })
                                           )
                                       }}
                                       value={inputs.dpi} />
                                { isError("dpi") && errorMessage("dpi") }
                            </div>
                        </div>
                    </div>
                </fieldset>
            </form>

            <button type="submit" id={"generate-btn"}
                    className={"amplify-button amplify-field-group__control amplify-button--primary amplify-button--fullwidth btn btn-primary btn-lg"}
                    onClick={() => (window.hasOwnProperty("map")) ?
                            generatePrintMap("map", (window as { [key: string]: any })["map"] as MapRef) :
                            window.alert('This app does not have a "map" object in global scope')
                    } >
                Print Map & Data Analysis
            </button>
            <div id='spinner' />
        </div>
    );
}