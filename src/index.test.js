/**
 * @jest-environment jsdom
 */

import React from 'react';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime'
import { CustomElement } from '.';

console.error = jest.fn()

window.customElements.define('hello-world',
    class extends HTMLElement {
        constructor() {
            super();
            this.addEventListener("click", () =>
                this.dispatchEvent(new CustomEvent("knockknock", { detail: "" }))
            )
        }
    });

function click(element) {
    return new Promise((resolve) => {
        element.click()
        process.nextTick(resolve)
    })
}

beforeEach(() => console.error.mockReset())

test('Shows nothing when tag is missing, logging an error', () => {
    const component = renderer.create(
        <CustomElement>
        </CustomElement>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchInlineSnapshot("null");
    expect(console.error).toBeCalledTimes(1)
})
test('Renders a tag correctly', () => {
    const component = renderer.create(
        <CustomElement tag="hello-world">
        </CustomElement>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchInlineSnapshot(`<hello-world />`);
    expect(console.error).toBeCalledTimes(0)
})

test('Adds a property to the tag', () => {
    const component = renderer.create(
        <CustomElement
            tag="hello-world"
            who="me">
        </CustomElement>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchInlineSnapshot(`
    <hello-world
      who="me"
    />
    `);
    expect(console.error).toBeCalledTimes(0)
})
test('Transforms the attribute from camelCase to dashed correctly', () => {
    const component = renderer.create(
        <CustomElement
            tag="hello-world"
            whoIsThere="me"
            WithLeadingDashBecauseThoseShallNeverStartWithCapital="bla">
        </CustomElement>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchInlineSnapshot(`
    <hello-world
      -with-leading-dash-because-those-shall-never-start-with-capital="bla"
      who-is-there="me"
    />
    `);
    expect(console.error).toBeCalledTimes(0)
})
test('Adds events to the original dom, without passing it to the element', () => {
    const knockknock = jest.fn()
    const component = renderer.create(
        <CustomElement
            tag="hello-world"
            whoIsThere="me"
            knockknock={knockknock}>
        </CustomElement>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchInlineSnapshot(`
    <hello-world
      who-is-there="me"
    />
    `);
    expect(console.error).toBeCalledTimes(0)
})

test('Propagates the event correctly back to react', async () => {
    const knockknock = jest.fn()
    const container = document.createElement('div');
    document.body.appendChild(container)
    ReactDOM.render(<CustomElement
        tag="hello-world"
        whoIsThere="me"
        knockknock={knockknock}>
    </CustomElement>, container)

    // manually trigger the callback
    await click(document.querySelector("hello-world"))
    expect(knockknock).toBeCalledTimes(1)
});