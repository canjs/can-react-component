@function can-react-component can-react-component
@parent can-ecosystem
@description Create a React component out of a [can-component].
@package ../package.json

@signature `canReactComponent( displayName, CanComponent )`

Converts a [can-component] constructor into a React Component and updates the component’s `viewModel` any time the React props change.

```jsx
import CanComponent from "can-component";

const MyCanComponent = CanComponent.extend({ ... });
const InnerComponent = canReactComponent( "InnerComponent", MyCanComponent );

ReactDOM.render(
  <InnerComponent text="inner text" number={ 5 } />,
  document.getElementById("app")
)
```

Values will be passed to the `viewModel` in the same way they would be for a normal React Component, e.g. the `text` prop in the above example would provide the string `"inner text"` to the `viewModel`, `number` would provide the number `5`, etc.

Since the component doesn’t produce DOM artifacts of its own, you won’t end up with any wrapper divs or anything else to worry about, but [React Developer Tools](https://github.com/facebook/react-devtools) will show you the component with the `displayName` in the React tree.

@param {String} displayName (optional) The name of the created component. If this is not specified, it will be the CanComponent’s name appended with “Wrapper”.
@param {CanComponent} CanComponent Any [can-component].

@return {ReactComponent} A React component

@body

## Use

```jsx
import React from "react";
import CanComponent from "can-component";
import canReactComponent from "can-react-component";

const InnerComponent = canReactComponent(
  CanComponent.extend("InnerComponent", {
    tag: "inner-component",
    view: stache("<div class='inner'>{{text}}</div>")
  })
);

export default class AppComponent extends Component {
  render() {
    return (
      <InnerComponent text="inner text" />
    );
  }
}
```
