'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMPTY_SET = undefined;
exports.default = getEntityRanges;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EMPTY_SET = exports.EMPTY_SET = (0, _immutable.OrderedSet)();
function getEntityRanges(text, charMetaList) {
  // TODO: use EMPTY_SET here
  var charEntity = null;
  var prevCharEntity = null;
  var pieces = [];
  var pieceStart = 0;
  for (var i = 0, len = text.length; i < len; i++) {
    prevCharEntity = charEntity;
    var meta = charMetaList.get(i);
    charEntity = meta ? meta.getEntity() : null;
    if (i > 0 && charEntity !== prevCharEntity) {
      pieces.push([prevCharEntity, getStylePieces(text.slice(pieceStart, i), charMetaList.slice(pieceStart, i))]);
      pieceStart = i;
    }
  }
  pieces.push([charEntity, getStylePieces(text.slice(pieceStart), charMetaList.slice(pieceStart))]);
  return pieces;
}

function getStylePieces(text, charMetaList) {
  var charStyle = EMPTY_SET;
  var prevCharStyle = EMPTY_SET;
  var pieces = [];
  var pieceStart = 0;
  for (var i = 0, len = text.length; i < len; i++) {
    prevCharStyle = charStyle;
    var meta = charMetaList.get(i);
    charStyle = meta ? meta.getStyle() : EMPTY_SET;
    if (i > 0 && !_immutable2.default.is(charStyle, prevCharStyle)) {
      pieces.push([text.slice(pieceStart, i), prevCharStyle]);
      pieceStart = i;
    }
  }
  pieces.push([text.slice(pieceStart), charStyle]);
  return pieces;
}