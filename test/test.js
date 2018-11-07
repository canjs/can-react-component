import QUnit from 'steal-qunit';
import React from 'react';
import ReactDOM  from 'react-dom';
import DefineMap from 'can-define/map/map';
import CanComponent from 'can-component';
import stache from 'can-stache';
// old stealjs does not seem to handle named exports properly
const Component = React.Component;

import canReactComponent from 'can-react-component';

function getTextFromFrag(node) {
	var txt = "";
	node = node.firstChild;
	while(node) {
		if(node.nodeType === 3) {
			txt += node.nodeValue;
		} else {
			txt += getTextFromFrag(node);
		}
		node = node.nextSibling;
	}
	return txt;
}

QUnit.module('can-react-component', (moduleHooks) => {

	const container = document.getElementById("qunit-fixture");

	moduleHooks.afterEach(() => {
		ReactDOM.unmountComponentAtNode(container);
	});

	QUnit.test('should be able to consume components', (assert) => {

		let ViewModel = DefineMap.extend('ViewModel', {
			first: {
				type: 'string',
				default: 'Christopher'
			},
			last: 'string',
			name: {
				get() {
					return this.first + ' ' + this.last;
				}
			}
		});

		const ConsumedComponent = canReactComponent(
			'ConsumedComponent',
			CanComponent.extend('ConsumedComponent', {
				tag: "consumed-component1",
				ViewModel: ViewModel,
				view: stache("<div class='inner'>{{name}}</div>")
			})
		);

		const testInstance = ReactDOM.render(<ConsumedComponent last="Baker" />, container);
		const divComponent = document.getElementsByTagName('consumed-component1')[0];
		assert.equal(testInstance.constructor.name, 'ConsumedComponent');
		assert.equal(getTextFromFrag(divComponent), 'Christopher Baker');
		testInstance.viewModel.first = 'Yetti';
		assert.equal(getTextFromFrag(divComponent), 'Yetti Baker');

	});

	QUnit.test('should work without a displayName', (assert) => {

		let ViewModel = DefineMap.extend('ViewModel', {
			first: {
				type: 'string',
				default: 'Christopher'
			},
			last: 'string',
			name: {
				get() {
					return this.first + ' ' + this.last;
				}
			}
		});

		const ConsumedComponent = canReactComponent(
			CanComponent.extend('ConsumedComponent', {
				tag: "consumed-component2",
				ViewModel: ViewModel,
				view: stache("<div class='inner'>{{name}}</div>")
			})
		);

		const testInstance = ReactDOM.render(<ConsumedComponent last="Baker" />, container);
		const divComponent = document.getElementsByTagName('consumed-component2')[0];

		assert.equal(testInstance.constructor.name, 'ConsumedComponentWrapper');
		assert.equal(getTextFromFrag(divComponent), 'Christopher Baker');

	});

	QUnit.test('should update the component when new props are received', (assert) => {

		let ViewModel = DefineMap.extend('ViewModel', {
			first: {
				type: 'string',
				default: 'Christopher'
			},
			last: 'string',
			name: {
				get() {
					return this.first + ' ' + this.last;
				}
			}
		});

		const ConsumedComponent = canReactComponent(
			CanComponent.extend('ConsumedComponent', {
				tag: "consumed-component3",
				ViewModel: ViewModel,
				view: stache("<div class='inner'>{{name}}</div>")
			})
		);

		class WrappingComponent extends Component {
			constructor() {
				super();

				this.state = {
					first: 'Christopher',
					last: 'Baker'
				};
			}

			changeState() {
				this.setState({ first: 'Yetti' });
			}

			render() {
				return <ConsumedComponent first={this.state.first} last={this.state.last} />;
			}
		}

		const wrappingInstance = ReactDOM.render(<WrappingComponent />, container);
		const divComponent = document.getElementsByTagName('consumed-component3')[0];

		assert.equal(getTextFromFrag(divComponent), 'Christopher Baker');
		wrappingInstance.changeState();
		assert.equal(getTextFromFrag(divComponent), 'Yetti Baker');

	});

});
