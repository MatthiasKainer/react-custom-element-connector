# React Custom Element Wrapper

A simple wrapper that allows you to wrap custom elements in reactjs.

## Install

`npm install react-custom-element-connector`

## Usage

Say you have a custom element `hello-world` created via `pure-lib` with a prop `whoIsThere` and an event `knockknock` that's triggered when clicked.

```js
const who = "me";
return html`<hello-world 
    .whoIsThere=${who} 
    @knockknock=${e => console.log(e.detail)}
></hello-world>`
```

This element can be used like this:

```jsx
const who = "me";
<CustomElement
  tag="hello-world"
  whoIsThere={who}
  knockknock={console.log}
/>
```

The wrapper will take care to:

- transform `camelCase` attributes to `dashed`, as react doesn't support camelCase for attributes (this will only work if your framework supports that. `@angular/elements` and `pure-lit` do this out of the box, `lit` will need manual work)
- attach an event listener to the dom event and adds it to the virtual element.

