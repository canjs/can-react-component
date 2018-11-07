var React = require("react");
var assign = require("can-assign");
var namespace = require('can-namespace');
var canSymbol = require('can-symbol');
var viewModelSymbol = canSymbol.for('can.viewModel');

module.exports = namespace.reactComponent = function canReactComponent(displayName, CanComponent) {
	if (arguments.length === 1) {
		CanComponent = arguments[0];
		displayName = (CanComponent.shortName || "CanComponent") + "Wrapper";
	}

	function Wrapper() {
		React.Component.call(this);

		this.canComponent = null;
		this.createComponent = this.createComponent.bind(this);
	}

	Wrapper.displayName = displayName;
	Wrapper.prototype = Object.create(React.Component.prototype);

	assign(Wrapper.prototype, {
		constructor: Wrapper,

		createComponent: function(el) {
			if (this.canComponent) {
				this.canComponent = null;
			}

			if (el) {
				this.vm = el[viewModelSymbol];
				this.vm.assign(this.props);
			}
		},

		componentWillUpdate: function(props) {
			this.vm.assign(props);
		},

		render: function() { // eslint-disable-line react/display-name
			return React.createElement(CanComponent.prototype.tag, {
				ref: this.createComponent,
			});
		}
	});

	Object.defineProperty(Wrapper.prototype, "viewModel", {
		enumerable: false,
		configurable: true,
		get: function() {
			return this.vm;
		}
	});

	try {
		Object.defineProperty(Wrapper, "name", {
			writable: false,
			enumerable: false,
			configurable: true,
			value: displayName
		});
	}
	catch(e) {
		//
	}

	return Wrapper;
};
