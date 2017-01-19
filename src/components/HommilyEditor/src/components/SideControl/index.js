'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SideControl = require('./SideControl.css');

var _SideControl2 = _interopRequireDefault(_SideControl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SideControl = function (_Component) {
	_inherits(SideControl, _Component);

	function SideControl() {
		_classCallCheck(this, SideControl);

		return _possibleConstructorReturn(this, (SideControl.__proto__ || Object.getPrototypeOf(SideControl)).apply(this, arguments));
	}

	_createClass(SideControl, [{
		key: 'toggleInlineStyle',
		value: function toggleInlineStyle(style) {
			if (this.props.toggleInlineStyle) this.props.toggleInlineStyle(style);
		}
	}, {
		key: 'toggleBlockType',
		value: function toggleBlockType(blockType) {
			if (this.props.toggleBlockType) this.props.toggleBlockType(blockType);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			return _react2.default.createElement(
				'div',
				{ className: _SideControl2.default.container,
					style: this.props.style

				},
				_react2.default.createElement('div', { className: _SideControl2.default.imgIsabled, onMouseDown: this.props.onImageClick }),
				_react2.default.createElement('div', {
					className: this.props.currentInlineStyle && this.props.currentInlineStyle.has('BOLD') ? _SideControl2.default.boldSelected : _SideControl2.default.boldIsabled,
					onMouseDown: function onMouseDown(e) {
						e.preventDefault();
						_this2.toggleInlineStyle('BOLD');
					}
				}),
				_react2.default.createElement('div', {
					className: this.props.currentInlineStyle && this.props.currentInlineStyle.has('ITALIC') ? _SideControl2.default.italicSelected : _SideControl2.default.italicIsabled,
					onMouseDown: function onMouseDown(e) {
						e.preventDefault();
						_this2.toggleInlineStyle('ITALIC');
					}
				}),
				_react2.default.createElement('div', {
					className: this.props.selectedBlockType === 'header-two' ? _SideControl2.default.titleSelected : _SideControl2.default.titleIsabled,
					onMouseDown: function onMouseDown(e) {
						e.preventDefault();
						_this2.toggleBlockType('header-two');
					}
				}),
				_react2.default.createElement('div', {
					className: this.props.selectedBlockType === 'unordered-list-item' ? _SideControl2.default.ulSelected : _SideControl2.default.ulIsabled,
					onMouseDown: function onMouseDown(e) {
						e.preventDefault();
						_this2.toggleBlockType('unordered-list-item');
					}

				}),
				_react2.default.createElement('div', {
					className: this.props.selectedBlockType === 'ordered-list-item' ? _SideControl2.default.olSelected : _SideControl2.default.olIsabled,
					onMouseDown: function onMouseDown(e) {
						e.preventDefault();
						_this2.toggleBlockType('ordered-list-item');
					}

				}),
				_react2.default.createElement('div', { className: _SideControl2.default.undoIsabled, onMouseDown: function onMouseDown(e) {
						e.preventDefault();
						_this2.props.onEditorChange(_this2.props.EditorState.undo(_this2.props.editorState));
					} }),
				_react2.default.createElement('div', { className: _SideControl2.default.redoIsabled, onMouseDown: function onMouseDown(e) {
						e.preventDefault();
						_this2.props.onEditorChange(_this2.props.EditorState.redo(_this2.props.editorState));
					} })
			);
		}
	}]);

	return SideControl;
}(_react.Component);

SideControl.propTypes = {
	style: _react2.default.PropTypes.object,
	onImageClick: _react2.default.PropTypes.func,
	toggleBlockType: _react2.default.PropTypes.func,
	selectedBlockType: _react2.default.PropTypes.string,
	toggleInlineStyle: _react2.default.PropTypes.func,
	currentInlineStyle: _react2.default.PropTypes.object
};
exports.default = SideControl;
module.exports = exports['default'];