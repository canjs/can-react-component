import QUnit from 'steal-qunit';
import React from 'react';
import ReactDOM  from 'react-dom';
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

		const ConsumedComponent = canReactComponent(
			'ConsumedComponent',
			CanComponent.extend('ConsumedComponent', {
				tag: "consumed-component1",
				ViewModel: {
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
				},
				view: stache("<div class='inner'>{{name}}</div>")
			})
		);

		const testInstanceRef = React.createRef();

		ReactDOM.render(<ConsumedComponent last="Baker" ref={testInstanceRef} />, container);
		const divComponent = document.getElementsByTagName('consumed-component1')[0];
		assert.equal(testInstanceRef.current.constructor.name, 'ConsumedComponent');
		assert.equal(getTextFromFrag(divComponent), 'Christopher Baker');
		testInstanceRef.current.viewModel.first = 'Yetti';
		assert.equal(getTextFromFrag(divComponent), 'Yetti Baker');

	});

	QUnit.test('should work without a displayName', (assert) => {

		const ConsumedComponent = canReactComponent(
			CanComponent.extend('ConsumedComponent', {
				tag: "consumed-component2",
				ViewModel: {
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
				},
				view: stache("<div class='inner'>{{name}}</div>")
			})
		);

		const testInstanceRef = React.createRef();
		ReactDOM.render(<ConsumedComponent last="Baker" ref={testInstanceRef} />, container);
		const divComponent = document.getElementsByTagName('consumed-component2')[0];

		assert.equal(testInstanceRef.current.constructor.name, 'ConsumedComponentWrapper');
		assert.equal(getTextFromFrag(divComponent), 'Christopher Baker');

	});

	QUnit.test('should update the component when new props are received', (assert) => {

		const ConsumedComponent = canReactComponent(
			CanComponent.extend('ConsumedComponent', {
				tag: "consumed-component3",
				ViewModel: {
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
				},
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

		const wrappingInstanceRef = React.createRef();
		ReactDOM.render(<WrappingComponent ref={wrappingInstanceRef} />, container);
		const divComponent = document.getElementsByTagName('consumed-component3')[0];

		assert.equal(getTextFromFrag(divComponent), 'Christopher Baker');
		wrappingInstanceRef.current.changeState();
		assert.equal(getTextFromFrag(divComponent), 'Yetti Baker');

	});


	QUnit.test('should be rendered only once', (assert) => {
		assert.expect(3);
		const ConsumedComponent = canReactComponent(
			'ConsumedComponent',
			CanComponent.extend('ConsumedComponent', {
				tag: "consumed-component4",
				ViewModel: {
					first: {
						type: 'string',
						default: 'Ivo'
					},
					last: 'string',
					name: {
						get() {
							return this.first + ' ' + this.last;
						}
					},
					connectedCallback(el){
						if(el.getAttribute("auto-mount") === "false") {
							assert.equal(this.last, "Pinheiro", `'last' name should be 'Pinheiro'`);
						}
					}
				},
				view: stache("<div class='inner'>{{name}}</div>")
			})
		);

		container.innerHTML="<consumed-component4></consumed-component4>";

		let divComponent = document.querySelector('consumed-component4');
		assert.equal(getTextFromFrag(divComponent), 'Ivo undefined');

		ReactDOM.render(<ConsumedComponent last={"Pinheiro"} />, container);
		divComponent = document.querySelector('consumed-component4');
		assert.equal(getTextFromFrag(divComponent), 'Ivo Pinheiro');
	});

});
