'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _SideControl = require('./SideControl');

var _SideControl2 = _interopRequireDefault(_SideControl);

var _draftJs = require('draft-js');

var _ImageComponent = require('../components/ImageComponent');

var _ImageComponent2 = _interopRequireDefault(_ImageComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  editorContainer: {
    position: 'relative',
    minHeight: 500,
    width: '100%',
    backgroundColor: '#fff'
  },
  sideControl: {}
};

var RichEditor = function (_Component) {
  _inherits(RichEditor, _Component);

  function RichEditor(props) {
    _classCallCheck(this, RichEditor);

    var _this = _possibleConstructorReturn(this, (RichEditor.__proto__ || Object.getPrototypeOf(RichEditor)).call(this, props));

    window.addEventListener('scroll', _this._scrollBar.bind(_this));
    _this.focus = function () {
      return _this.refs.editor.focus();
    };
    _this.handleKeyCommand = function (command) {
      return _this._handleKeyCommand(command);
    };
    _this.handleFileInput = function (e) {
      return _this._handleFileInput(e);
    };
    _this.handleUploadImage = function () {
      return _this._handleUploadImage();
    };
    _this.toggleBlockType = function (type) {
      return _this._toggleBlockType(type);
    };
    _this.toggleInlineStyle = function (style) {
      return _this._toggleInlineStyle(style);
    };
    _this.insertImage = function (file) {
      return _this._insertImage(file);
    };
    _this.state = {
      editorState: _draftJs.EditorState.createEmpty()
    };
    _this.onChange = function (editorState) {
      _this.setState({
        editorState: editorState
      });
    };
    _this.blockRenderer = function (block) {
      if (block.getType() === 'atomic') {
        return {
          component: _ImageComponent2.default
        };
      }
      return null;
    };
    _this.blockStyler = function (block) {
      if (block.getType() === 'unstyled') {
        return 'paragraph';
      }
      return null;
    };

    return _this;
  }

  _createClass(RichEditor, [{
    key: '_handleKeyCommand',
    value: function _handleKeyCommand(command) {
      var editorState = this.state.editorState;

      var newState = _draftJs.RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this.onChange(newState);
        return true;
      }
      return false;
    }
  }, {
    key: '_scrollBar',
    value: function _scrollBar() {
      var scrollTop = document.body.scrollTop;
      var SideControlComp = this.refs.sideControl;
      var container = document.getElementById(this.props.documentId || 'app');
      var sideControloffsetTop = sideControloffsetTop || 0;
      var offsetTop = container.offsetTop;
      var sideControlStyles = void 0;
      if (scrollTop - offsetTop + sideControloffsetTop > 0) {
        sideControlStyles = {};
        var editorHeight = this.refs.hommilyEditor.clientHeight;
        var sliderHeight = _reactDom2.default.findDOMNode(SideControlComp).clientHeight;
        if (scrollTop - offsetTop - editorHeight + sliderHeight + sideControloffsetTop > 0) {
          sideControlStyles.bottom = 0;
          sideControlStyles.position = 'absolute';
        } else {
          sideControlStyles.top = sideControloffsetTop;
          sideControlStyles.position = 'fixed';
        }
        this.setState({
          sideControlStyles: sideControlStyles
        });
      } else {
        sideControlStyles = {
          position: 'absolute',
          top: 0
        };
        this.setState({
          sideControlStyles: sideControlStyles
        });
      }
    }
  }, {
    key: '_toggleBlockType',
    value: function _toggleBlockType(blockType) {
      this.onChange(_draftJs.RichUtils.toggleBlockType(this.state.editorState, blockType));
    }
  }, {
    key: '_toggleInlineStyle',
    value: function _toggleInlineStyle(inlineStyle) {
      this.onChange(_draftJs.RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
    }
  }, {
    key: '_insertImage',
    value: function _insertImage(file) {
      var fileSrc = (typeof file === 'undefined' ? 'undefined' : _typeof(file)) == "object" ? URL.createObjectURL(file) : file;
      var entityKey = _draftJs.Entity.create('atomic', 'IMMUTABLE', {
        src: fileSrc
      });
      this.onChange(_draftJs.AtomicBlockUtils.insertAtomicBlock(this.state.editorState, entityKey, ' '));
    }
  }, {
    key: '_handleFileInput',
    value: function _handleFileInput(e) {
      var fileList = e.target.files;
      var file = fileList[0];

      if (typeof this.props.uploadImg != "undefined" && typeof this.props.uploadImg == "function") {
        this.props.uploadImg(file, this.insertImage);
        return;
      }
      this.insertImage(file);
    }
  }, {
    key: '_handleUploadImage',
    value: function _handleUploadImage() {
      this.refs.fileInput.click();
    }
  }, {
    key: 'getFirstBlockText',
    value: function getFirstBlockText() {
      var currentContentState = this.getCurrentContent();
      var blocksArray = currentContentState.getBlocksAsArray();
      var _text = null;
      for (var i = 0; i < blocksArray.length; i++) {
        if (blocksArray[i].getText().length > 0) {
          _text = blocksArray[i].getText();

          break;
        }
      }
      return _text;
    }
  }, {
    key: 'getContent',
    value: function getContent() {
      var content = this.state.editorState.getCurrentContent();
      return (0, _draftJs.convertToRaw)(content);
    }
  }, {
    key: 'getEditorState',
    value: function getEditorState() {

      return this.state.editorState;
    }
  }, {
    key: 'getCurrentContent',
    value: function getCurrentContent() {

      return this.state.editorState.getCurrentContent();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('scroll', this._scrollBar.bind(this));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var editorState = this.state.editorState;
      var currentInlineStyle = editorState.getCurrentInlineStyle();
      var selection = editorState.getSelection();
      var selectedBlockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
      var sideControlStyles = Object.assign({}, styles.sideControl, this.state.sideControlStyles);
      var className = 'RichEditor-editor';
      return _react2.default.createElement(
        'div',
        { ref: 'hommilyEditor', style: Object.assign({}, styles.editorContainer, this.props.style),
          className: 'RichEditor', onClick: this.focus },
        _react2.default.createElement(_SideControl2.default, { style: sideControlStyles,
          onImageClick: this.props.onImageClick
          // This editor will support a real basic example of inserting an image
          // into the page, just so something works out the box.
          || function (e) {
            return _this2.refs['fileInput'].click();
          },
          toggleBlockType: this.toggleBlockType,
          selectedBlockType: selectedBlockType,
          toggleInlineStyle: this.toggleInlineStyle,
          currentInlineStyle: currentInlineStyle,
          onEditorChange: this.onChange,
          EditorState: _draftJs.EditorState,
          editorState: this.state.editorState,
          ref: 'sideControl'
        }),
        _react2.default.createElement(
          'div',
          { className: className },
          _react2.default.createElement(_draftJs.Editor, {
            blockRendererFn: this.blockRenderer,
            blockStyleFn: this.blockStyler,
            editorState: editorState,
            handleKeyCommand: this.handleKeyCommand,
            onChange: this.onChange,
            placeholder: 'Write something...'
            // readOnly={this.state.editingImage}
            , ref: 'editor'
          })
        ),
        _react2.default.createElement('input', { type: 'file', ref: 'fileInput', style: {
            display: 'none'
          },
          onChange: this.handleFileInput })
      );
    }
  }]);

  return RichEditor;
}(_react.Component);

exports.default = RichEditor;
module.exports = exports['default'];