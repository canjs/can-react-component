var React = require("react");
var Scope = require("can-view-scope");
var assign = require("can-util/js/assign/assign");
var namespace = require('can-namespace');

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
				this.canComponent = new CanComponent(el, {
					subtemplate: null,
					templateType: "react",
					parentNodeList: undefined,
					options: Scope.refsScope().add({}),
					scope: new Scope.Options({}),
					setupBindings: function(el, makeViewModel, initialViewModelData) {
						assign(initialViewModelData, this.props);
						makeViewModel(initialViewModelData);
					}.bind(this),
				});
			}
		},

		componentWillUpdate: function(props) {
			this.canComponent.viewModel.assign(props);
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
			return this.canComponent && this.canComponent.viewModel;
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
