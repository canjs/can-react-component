/*can-react-component@3.0.0-pre.0#can-react-component*/
define([
    'require',
    'exports',
    'module',
    'react',
    'can-namespace',
    'can-assign',
    'can-reflect',
    'can-symbol',
    'can-view-callbacks'
], function (require, exports, module) {
    var React = require('react');
    var namespace = require('can-namespace');
    var assign = require('can-assign');
    var reflect = require('can-reflect');
    var canSymbol = require('can-symbol');
    var viewCallbacks = require('can-view-callbacks');
    var viewModelSymbol = canSymbol.for('can.viewModel');
    module.exports = namespace.reactComponent = function canReactComponent(displayName, CanComponent) {
        if (arguments.length === 1) {
            CanComponent = arguments[0];
            displayName = (CanComponent.shortName || 'CanComponent') + 'Wrapper';
        }
        const __renderComponent = viewCallbacks._tags[CanComponent.prototype.tag];
        viewCallbacks._tags[CanComponent.prototype.tag] = function renderComponent(el) {
            if (el.getAttribute('auto-mount') !== 'false') {
                __renderComponent.apply(this, arguments);
            }
        };
        function Wrapper() {
            React.Component.call(this);
            this.canComponent = null;
            this.createComponent = this.createComponent.bind(this);
        }
        Wrapper.displayName = displayName;
        Wrapper.prototype = Object.create(React.Component.prototype);
        assign(Wrapper.prototype, {
            constructor: Wrapper,
            createComponent: function (el) {
                if (this.canComponent) {
                    this.canComponent = null;
                }
                if (el) {
                    this.vm = el[viewModelSymbol];
                    if (this.vm) {
                        reflect.assign(this.vm, this.props);
                    } else {
                        this.canComponent = new CanComponent(el, { viewModel: this.props });
                        this.vm = this.canComponent.viewModel;
                    }
                }
            },
            componentDidUpdate: function () {
                this.vm && reflect.assign(this.vm, this.props);
            },
            render: function () {
                return React.createElement(CanComponent.prototype.tag, {
                    ref: this.createComponent,
                    'auto-mount': 'false'
                });
            }
        });
        Object.defineProperty(Wrapper.prototype, 'viewModel', {
            enumerable: false,
            configurable: true,
            get: function () {
                return this.vm;
            }
        });
        try {
            Object.defineProperty(Wrapper, 'name', {
                writable: false,
                enumerable: false,
                configurable: true,
                value: displayName
            });
        } catch (e) {
        }
        return Wrapper;
    };
});