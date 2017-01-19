'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NODE_TYPE_ELEMENT = exports.NODE_TYPE_ELEMENT = 1;
var NODE_TYPE_TEXT = exports.NODE_TYPE_TEXT = 3;
var NODE_TYPE_FRAGMENT = exports.NODE_TYPE_FRAGMENT = 11;
var SELF_CLOSING = exports.SELF_CLOSING = [];

var Node = exports.Node = function Node() {
  _classCallCheck(this, Node);
};

var TextNode = exports.TextNode = function (_Node) {
  _inherits(TextNode, _Node);

  function TextNode(value) {
    _classCallCheck(this, TextNode);

    var _this = _possibleConstructorReturn(this, (TextNode.__proto__ || Object.getPrototypeOf(TextNode)).apply(this, arguments));

    _this.nodeType = NODE_TYPE_TEXT;
    _this.nodeName = '#text';
    _this.nodeValue = value;
    return _this;
  }

  _createClass(TextNode, [{
    key: 'toString',
    value: function toString() {
      return escape(this.nodeValue);
    }
  }]);

  return TextNode;
}(Node);

var ElementNode = exports.ElementNode = function (_Node2) {
  _inherits(ElementNode, _Node2);

  function ElementNode(name, attributes, childNodes) {
    _classCallCheck(this, ElementNode);

    var _this2 = _possibleConstructorReturn(this, (ElementNode.__proto__ || Object.getPrototypeOf(ElementNode)).apply(this, arguments));

    var isSelfClosing = childNodes === SELF_CLOSING;
    _this2.nodeType = NODE_TYPE_ELEMENT;
    _this2.nodeName = name;
    _this2.attributes = attributes || [];
    _this2.attributesMap = new Map(attributes);
    _this2.childNodes = [];
    _this2.isSelfClosing = isSelfClosing;
    if (!isSelfClosing && childNodes) {
      childNodes.forEach(_this2.appendChild, _this2);
    }
    return _this2;
  }

  _createClass(ElementNode, [{
    key: 'appendChild',
    value: function appendChild(node) {
      if (node.nodeType === NODE_TYPE_FRAGMENT) {
        if (node.childNodes != null) {
          var _childNodes;

          (_childNodes = this.childNodes).push.apply(_childNodes, _toConsumableArray(node.childNodes));
        }
      } else {
        this.childNodes.push(node);
      }
    }
  }, {
    key: 'getAttribute',
    value: function getAttribute(name) {
      return this.attributesMap.get(name);
    }
  }, {
    key: 'toString',
    value: function toString(isXHTML) {
      var attributes = this.attributes.map(function (attr) {
        return attr[0] + (attr[1] ? '=' + escapeAttr(attr[1]) : '');
      }).join(' ');
      if (attributes.length) {
        attributes = ' ' + attributes;
      }
      if (this.isSelfClosing) {
        return '<' + this.nodeName + attributes + (isXHTML ? '/>' : '>');
      }
      if (this.childNodes != null) {}
      var childNodes = this.childNodes.map(function (node) {
        return node.toString(isXHTML);
      }).join('');
      return '<' + this.nodeName + attributes + '>' + childNodes + '</' + this.nodeName + '>';
    }
  }]);

  return ElementNode;
}(Node);

var FragmentNode = exports.FragmentNode = function (_Node3) {
  _inherits(FragmentNode, _Node3);

  function FragmentNode(childNodes) {
    _classCallCheck(this, FragmentNode);

    var _this3 = _possibleConstructorReturn(this, (FragmentNode.__proto__ || Object.getPrototypeOf(FragmentNode)).apply(this, arguments));

    _this3.nodeType = NODE_TYPE_FRAGMENT;
    _this3.childNodes = [];
    if (childNodes) {
      childNodes.forEach(_this3.appendChild, _this3);
    }
    return _this3;
  }

  _createClass(FragmentNode, [{
    key: 'appendChild',
    value: function appendChild(node) {
      if (node.nodeType === NODE_TYPE_FRAGMENT) {
        if (node.childNodes != null) {
          var _childNodes2;

          (_childNodes2 = this.childNodes).push.apply(_childNodes2, _toConsumableArray(node.childNodes));
        }
      } else {
        this.childNodes.push(node);
      }
    }
  }, {
    key: 'toString',
    value: function toString(isXHTML) {
      return this.childNodes.map(function (node) {
        return node.toString(isXHTML);
      }).join('');
    }
  }]);

  return FragmentNode;
}(Node);

function escape(html) {
  return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(html) {
  return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}