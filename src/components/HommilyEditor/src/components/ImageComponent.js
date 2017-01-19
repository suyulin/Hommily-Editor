'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var block = _ref.block;

  var imgContent = _draftJs.Entity.get(block.getEntityAt(0)).data.src;
  return _react2.default.createElement('img', { src: imgContent });
};

module.exports = exports['default'];