'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = stateToHTML;

var _draftJs = require('draft-js');

var _main = require('../../draft-js-tools/src/main');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BOLD = _main.INLINE_STYLE.BOLD,
    CODE = _main.INLINE_STYLE.CODE,
    ITALIC = _main.INLINE_STYLE.ITALIC,
    STRIKETHROUGH = _main.INLINE_STYLE.STRIKETHROUGH,
    UNDERLINE = _main.INLINE_STYLE.UNDERLINE;


var INDENT = '  ';
var BREAK = '<br/>';

// TODO: Move these getter functions. Also accept alternatives via config.

// The reason this returns an array is because a single block might get wrapped
// in two tags.
function getTags(blockType) {
  switch (blockType) {
    case _main.BLOCK_TYPE.HEADER_ONE:
      return ['h1'];
    case _main.BLOCK_TYPE.HEADER_TWO:
      return ['h2'];
    case _main.BLOCK_TYPE.HEADER_THREE:
      return ['h3'];
    case _main.BLOCK_TYPE.HEADER_FOUR:
      return ['h4'];
    case _main.BLOCK_TYPE.HEADER_FIVE:
      return ['h5'];
    case _main.BLOCK_TYPE.HEADER_SIX:
      return ['h6'];
    case _main.BLOCK_TYPE.IMAGE:
      return ['img'];
    case _main.BLOCK_TYPE.UNORDERED_LIST_ITEM:
    case _main.BLOCK_TYPE.ORDERED_LIST_ITEM:
      return ['li'];
    case _main.BLOCK_TYPE.BLOCKQUOTE:
      return ['blockquote'];
    case _main.BLOCK_TYPE.CODE:
      return ['pre', 'code'];
    default:
      return ['p'];
  }
}

function getWrapperTag(blockType) {
  switch (blockType) {
    case _main.BLOCK_TYPE.UNORDERED_LIST_ITEM:
      return 'ul';
    case _main.BLOCK_TYPE.ORDERED_LIST_ITEM:
      return 'ol';
    default:
      return null;
  }
}

function canHaveDepth(blockType) {
  switch (blockType) {
    case _main.BLOCK_TYPE.UNORDERED_LIST_ITEM:
    case _main.BLOCK_TYPE.ORDERED_LIST_ITEM:
      return true;
    default:
      return false;
  }
}

function encodeContent(text) {
  return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('\xA0').join('&nbsp;').split('\n').join(BREAK + '\n');
}

function encodeAttr(text) {
  return text.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
}

var MarkupGenerator = function () {
  function MarkupGenerator(contentState) {
    _classCallCheck(this, MarkupGenerator);

    this.contentState = contentState;
  }

  _createClass(MarkupGenerator, [{
    key: 'generate',
    value: function generate() {
      this.output = [];
      this.blocks = this.contentState.getBlocksAsArray();
      this.totalBlocks = this.blocks.length;
      this.currentBlock = 0;
      this.indentLevel = 0;
      this.wrapperTag = null;
      while (this.currentBlock < this.totalBlocks) {
        this.processBlock();
      }
      this.closeWrapperTag();
      return this.output.join('').trim();
    }
  }, {
    key: 'processBlock',
    value: function processBlock() {
      var block = this.blocks[this.currentBlock];
      var blockType = block.getType();
      var newWrapperTag = getWrapperTag(blockType);
      if (this.wrapperTag !== newWrapperTag) {
        if (this.wrapperTag) {
          this.closeWrapperTag();
        }
        if (newWrapperTag) {
          this.openWrapperTag(newWrapperTag);
        }
      }
      this.indent();
      this.writeStartTag(blockType);
      this.output.push(this.renderBlockContent(block));
      // Look ahead and see if we will nest list.
      var nextBlock = this.getNextBlock();
      if (canHaveDepth(blockType) && nextBlock && nextBlock.getDepth() === block.getDepth() + 1) {
        this.output.push('\n');
        // This is a litle hacky: temporarily stash our current wrapperTag and
        // render child list(s).
        var thisWrapperTag = this.wrapperTag;
        this.wrapperTag = null;
        this.indentLevel += 1;
        this.currentBlock += 1;
        this.processBlocksAtDepth(nextBlock.getDepth());
        this.wrapperTag = thisWrapperTag;
        this.indentLevel -= 1;
        this.indent();
      } else {
        this.currentBlock += 1;
      }
      this.writeEndTag(blockType);
    }
  }, {
    key: 'processBlocksAtDepth',
    value: function processBlocksAtDepth(depth) {
      var block = this.blocks[this.currentBlock];
      while (block && block.getDepth() === depth) {
        this.processBlock();
        block = this.blocks[this.currentBlock];
      }
      this.closeWrapperTag();
    }
  }, {
    key: 'getNextBlock',
    value: function getNextBlock() {
      return this.blocks[this.currentBlock + 1];
    }
  }, {
    key: 'writeStartTag',
    value: function writeStartTag(blockType) {
      var tags = getTags(blockType);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = tags[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var tag = _step.value;

          if (tag == 'img') {
            this.output.push('<' + tag + ' src="');
          } else {

            this.output.push('<' + tag + '>');
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'writeEndTag',
    value: function writeEndTag(blockType) {
      var tags = getTags(blockType);
      if (tags.length === 1) {

        if (tags[0] == 'img') {
          this.output.push('"/>\n');
        } else {
          this.output.push('</' + tags[0] + '>\n');
        }
      } else {
        var output = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = tags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var tag = _step2.value;

            output.unshift('</' + tag + '>');
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this.output.push(output.join('') + '\n');
      }
    }
  }, {
    key: 'openWrapperTag',
    value: function openWrapperTag(wrapperTag) {
      this.wrapperTag = wrapperTag;
      this.indent();
      this.output.push('<' + wrapperTag + '>\n');
      this.indentLevel += 1;
    }
  }, {
    key: 'closeWrapperTag',
    value: function closeWrapperTag() {
      if (this.wrapperTag) {
        this.indentLevel -= 1;
        this.indent();
        this.output.push('</' + this.wrapperTag + '>\n');
        this.wrapperTag = null;
      }
    }
  }, {
    key: 'indent',
    value: function indent() {
      this.output.push(INDENT.repeat(this.indentLevel));
    }
  }, {
    key: 'renderBlockContent',
    value: function renderBlockContent(block) {
      var blockType = block.getType();
      switch (blockType) {
        case "atomic":
          return this.renderImageBlockContent(block);
          break;
        default:
          return this.renderTextBlockContent(block, blockType);
          break;
      }
    }
  }, {
    key: 'renderImageBlockContent',
    value: function renderImageBlockContent(block) {
      var charMetaList = block.getCharacterList();
      var entityPieces = (0, _main.getEntityRanges)(block.getText(), charMetaList);
      return entityPieces.map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            entityKey = _ref2[0],
            stylePieces = _ref2[1];

        var entity = entityKey ? _draftJs.Entity.get(entityKey) : null;
        return entity.getData().src;
      }).join('');
    }
  }, {
    key: 'renderTextBlockContent',
    value: function renderTextBlockContent(block, blockType) {
      var text = block.getText();
      if (text === '') {
        // Prevent element collapse if completely empty.
        return BREAK;
      }
      text = this.preserveWhitespace(text);
      var charMetaList = block.getCharacterList();
      var entityPieces = (0, _main.getEntityRanges)(text, charMetaList);
      return entityPieces.map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            entityKey = _ref4[0],
            stylePieces = _ref4[1];

        var content = stylePieces.map(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              text = _ref6[0],
              style = _ref6[1];

          var content = encodeContent(text);
          // These are reverse alphabetical by tag name.
          if (style.has(BOLD)) {
            content = '<strong>' + content + '</strong>';
          }
          if (style.has(UNDERLINE)) {
            content = '<ins>' + content + '</ins>';
          }
          if (style.has(ITALIC)) {
            content = '<em>' + content + '</em>';
          }
          if (style.has(STRIKETHROUGH)) {
            content = '<del>' + content + '</del>';
          }
          if (style.has(CODE)) {
            // If our block type is CODE then we are already wrapping the whole
            // block in a `<code>` so don't wrap inline code elements.
            content = blockType === _main.BLOCK_TYPE.CODE ? content : '<code>' + content + '</code>';
          }
          return content;
        }).join('');
        var entity = entityKey ? _draftJs.Entity.get(entityKey) : null;
        if (entity != null && entity.getType() === _main.ENTITY_TYPE.LINK) {
          var href = entity.getData().href || '';
          return '<a href="' + encodeAttr(href) + '">' + content + '</a>';
          // } else if(entity != null && entity.getType() === 'TOKEN') {
          //   let src = entity.getData().src || '';
          //     return `<img src="${encodeAttr(src)}" />`;
        } else {
          return content;
        }
      }).join('');
    }
  }, {
    key: 'preserveWhitespace',
    value: function preserveWhitespace(text) {
      var length = text.length;
      // Prevent leading/trailing/consecutive whitespace collapse.
      var newText = new Array(length);
      for (var i = 0; i < length; i++) {
        if (text[i] === ' ' && (i === 0 || i === length - 1 || text[i - 1] === ' ')) {
          newText[i] = '\xA0';
        } else {
          newText[i] = text[i];
        }
      }
      return newText.join('');
    }
  }]);

  return MarkupGenerator;
}();

function stateToHTML(content) {
  return new MarkupGenerator(content).generate();
}
module.exports = exports['default'];