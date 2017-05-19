'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _draftJs = require('draft-js');

var _Editor = require('../../components/HommilyEditor/src/Editor');

var _Editor2 = _interopRequireDefault(_Editor);

var _main = require('../../components/HommilyEditor/draft-js-export-html/src/main');

var _main2 = require('../../components/HommilyEditor/draft-js-import-html/src/main');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Post = function (_Component) {
  _inherits(Post, _Component);

  function Post(props) {
    _classCallCheck(this, Post);

    return _possibleConstructorReturn(this, (Post.__proto__ || Object.getPrototypeOf(Post)).call(this, props));
  }

  _createClass(Post, [{
    key: 'editHandle',
    value: function editHandle(content) {
      var editor = this.refs.myEditor;
      var _editorState = editor.getEditorState();

      var _content = (0, _main2.stateFromHTML)(content);
      var editorState = _draftJs.EditorState.push(_editorState, _content, 'secondary-paste');
      editor.onChange(editorState);
    }
  }, {
    key: 'getFirstBlockText',
    value: function getFirstBlockText() {
      var editor = this.refs.myEditor;
      return editor.getFirstBlockText();
    }
  }, {
    key: 'onFocus',
    value: function onFocus() {
      var editor = this.refs.myEditor;
      editor._focus();
    }
  }, {
    key: 'getPlainText',
    value: function getPlainText() {
      var editor = this.refs.myEditor;
      return editor.getCurrentContent().getPlainText();
    }
  }, {
    key: 'uploadImg',
    value: function uploadImg(file, callback) {}
  }, {
    key: 'saveHandle',
    value: function saveHandle() {
      var editor = this.refs.myEditor;
      var editorState = editor.getCurrentContent();
      var _content = (0, _main.stateToHTML)(editorState);
      return _content;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'editor-root' },
        _react2.default.createElement(_Editor2.default, { ref: 'myEditor', uploadImg: this.props.uploadImg })
      );
    }
  }]);

  return Post;
}(_react.Component);

exports.default = Post;
module.exports = exports['default'];