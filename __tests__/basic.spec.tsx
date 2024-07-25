/**
 * @jest-environment jsdom
 */
import * as React from "react";
import { createRoot } from "react-dom/client";

let container: HTMLElement | null = null;
// let root = null;

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(<div></div>);
});

afterEach(() => {
    // cleanup on exiting
    // root.unmount();
    if (container !== null) {
        container.remove();
        container = null;
    }
});

describe("jsdom ", () => {
    it("environment should allow appending elements to the DOM tree", () => {
        const element = document.createElement('div');
        expect(element).not.toBeNull();
        document.body.appendChild(element);
        element.remove();
    });
});
