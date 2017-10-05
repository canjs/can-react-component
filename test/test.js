import QUnit from 'steal-qunit';
import React /*, { Component } */ from 'react';
import ReactTestUtils from 'react-dom/test-utils';
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

QUnit.module('can-react-component', () => {

	QUnit.test('should be able to consume components', (assert) => {

		let ViewModel = DefineMap.extend('ViewModel', {
			first: {
				type: 'string',
				value: 'Christopher'
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

		const testInstance = ReactTestUtils.renderIntoDocument( <ConsumedComponent last="Baker" /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'consumed-component1' );

		assert.equal(testInstance.constructor.name, 'ConsumedComponent');
		assert.equal(getTextFromFrag(divComponent), 'Christopher Baker');
		testInstance.viewModel.first = 'Yetti';
		assert.equal(getTextFromFrag(divComponent), 'Yetti Baker');

	});

	QUnit.test('should work without a displayName', (assert) => {

		let ViewModel = DefineMap.extend('ViewModel', {
			first: {
				type: 'string',
				value: 'Christopher'
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

		const testInstance = ReactTestUtils.renderIntoDocument( <ConsumedComponent last="Baker" /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( testInstance, 'consumed-component2' );

		assert.equal(testInstance.constructor.name, 'ConsumedComponentWrapper');
		assert.equal(getTextFromFrag(divComponent), 'Christopher Baker');

	});

	QUnit.test('should update the component when new props are received', (assert) => {

		let ViewModel = DefineMap.extend('ViewModel', {
			first: {
				type: 'string',
				value: 'Christopher'
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

		const wrappingInstance = ReactTestUtils.renderIntoDocument( <WrappingComponent /> );
		const divComponent = ReactTestUtils.findRenderedDOMComponentWithTag( wrappingInstance, 'consumed-component3' );

		assert.equal(getTextFromFrag(divComponent), 'Christopher Baker');
		wrappingInstance.changeState();
		assert.equal(getTextFromFrag(divComponent), 'Yetti Baker');

	});

});
