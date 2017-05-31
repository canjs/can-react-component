var React = require('react');
var Scope = require('can-view-scope');

module.exports = function canReactComponent(displayName, CanComponent) {
	if (arguments.length === 1) {
		CanComponent = arguments[0];
		displayName = `${CanComponent.name || 'CanComponent'}Wrapper`;
	}

	class Wrapper extends React.Component {
		static get name() { return displayName; }

		constructor() {
			super();

			this.canComponent = null;
			this.createComponent = this.createComponent.bind(this);
		}

		get viewModel() {
			return this.canComponent && this.canComponent.viewModel;
		}

		createComponent(el) {
			if (this.canComponent) {
				this.canComponent = null;
			}

			if (el) {
				this.canComponent = new CanComponent(el, {
					subtemplate: null,
					templateType: 'react',
					parentNodeList: undefined,
					options: Scope.refsScope().add({}),
					scope: new Scope.Options({}),
					setupBindings: (el, makeViewModel, initialViewModelData) => {
						Object.assign(initialViewModelData, this.props);
						makeViewModel(initialViewModelData);
					},
				});
			}
		}

		componentWillUpdate(props) {
			this.canComponent.viewModel.set(props);
		}

		render() {
			return React.createElement(CanComponent.prototype.tag, {
				ref: this.createComponent,
			});
		}
	}

	Wrapper.displayName = displayName;

	return Wrapper;
};
