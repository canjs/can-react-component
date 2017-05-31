@function can-react-component canReactComponent
@parent can-ecosystem
@description Create a React component out of a [can-component].
@package ../package.json

@signature `canReactComponent( displayName, CanComponent )`

```javascript
export default canReactComponent( 'AppComponent', CanComponent.extend({ ... }) )
```

Since the component doesn’t produce DOM artifacts of its own, you won’t end up with any wrapper divs or anything to worry about, but in react-device-tools you will see the component with the `displayName` (or defaults to `CanComponentWrapper`) in the tree.

@param {String} displayName The name of the created component
@param {CanComponent} CanComponent Any Can component

@return {ReactComponent} A React component

@body

## Use

```jsx
import React from 'react';
import CanComponent from 'can-component';
import canReactComponent from 'can-react-component';

const InnerComponent = canReactComponent(
  CanComponent.extend('InnerComponent', {
    tag: 'inner-component',
    view: stache('<div class="inner">{{text}}</div>')
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
