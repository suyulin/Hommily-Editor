'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = stateFromElement;

var _draftJs = require('draft-js');

var _immutable = require('immutable');

var _main = require('../../draft-js-tools/src/main');

var _SyntheticDOM = require('../../synthetic-dom/src/SyntheticDOM');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// A ParsedBlock has two purposes:
//   1) to keep data about the block (textFragments, type)
//   2) to act as some context for storing parser state as we parse its contents
var NO_STYLE = (0, _immutable.OrderedSet)();
var NO_ENTITY = null;

var EMPTY_BLOCK = new _draftJs.ContentBlock({
  key: (0, _draftJs.genKey)(),
  text: '',
  type: _main.BLOCK_TYPE.UNSTYLED,
  characterList: (0, _immutable.List)(),
  depth: 0
});

var LINE_BREAKS = /(\r\n|\r|\n)/g;

// TODO: Move this out to a module.
var INLINE_ELEMENTS = {
  a: 1, abbr: 1, area: 1, audio: 1, b: 1, bdi: 1, bdo: 1, br: 1, button: 1,
  canvas: 1, cite: 1, code: 1, command: 1, datalist: 1, del: 1, dfn: 1, em: 1,
  embed: 1, i: 1, iframe: 1, input: 1, ins: 1, kbd: 1, keygen: 1,
  label: 1, map: 1, mark: 1, meter: 1, noscript: 1, object: 1, output: 1,
  progress: 1, q: 1, ruby: 1, s: 1, samp: 1, script: 1, select: 1, small: 1,
  span: 1, strong: 1, sub: 1, sup: 1, textarea: 1, time: 1, u: 1, var: 1,
  video: 1, wbr: 1, acronym: 1, applet: 1, basefont: 1, big: 1, font: 1,
  isindex: 1, strike: 1, style: 1, tt: 1
};

// These elements are special because they cannot contain text as a direct
// child (or cannot contain childNodes at all).
var SPECIAL_ELEMENTS = {
  area: 1, base: 1, br: 1, col: 1, colgroup: 1, command: 1, dl: 1, embed: 1,
  head: 1, hgroup: 1, hr: 1, iframe: 1, input: 1, keygen: 1, link: 1,
  meta: 1, ol: 1, optgroup: 1, option: 1, param: 1, script: 1, select: 1,
  source: 1, style: 1, table: 1, tbody: 1, textarea: 1, tfoot: 1, thead: 1,
  title: 1, tr: 1, track: 1, ul: 1, wbr: 1, basefont: 1, dialog: 1, dir: 1,
  isindex: 1
};

var BlockGenerator = function () {
  function BlockGenerator() {
    _classCallCheck(this, BlockGenerator);

    // This represents the hierarchy as we traverse nested elements; for
    // example [body, ul, li] where we must know li's parent type (ul or ol).
    this.blockStack = [];
    // This is a linear list of blocks that will form the output; for example
    // [p, li, li, blockquote].
    this.blockList = [];
    this.depth = 0;
  }

  _createClass(BlockGenerator, [{
    key: 'process',
    value: function process(element) {
      this.processBlockElement(element);
      var contentBlocks = [];
      this.blockList.forEach(function (block) {
        var _concatFragments = concatFragments(block.textFragments),
            text = _concatFragments.text,
            characterMeta = _concatFragments.characterMeta;
        // If this block contains only a soft linebreak then don't discard it


        var includeEmptyBlock = text === '\r';
        if (block.tagName === 'pre') {
          var _trimLeadingNewline = trimLeadingNewline(text, characterMeta);

          text = _trimLeadingNewline.text;
          characterMeta = _trimLeadingNewline.characterMeta;
        } else {
          var _collapseWhiteSpace = collapseWhiteSpace(text, characterMeta);

          text = _collapseWhiteSpace.text;
          characterMeta = _collapseWhiteSpace.characterMeta;
        }
        if (block.tagName === 'img') {
          var charData = _draftJs.CharacterMetadata.create({ entity: block.entityStack });
          contentBlocks.push(new _draftJs.ContentBlock({
            key: (0, _draftJs.genKey)(),
            text: ' ',
            type: 'atomic',
            characterList: (0, _immutable.List)((0, _immutable.Repeat)(charData, 1)),
            depth: block.depth
          }));
        }
        // Discard empty blocks (unless otherwise specified).
        if (text.length || includeEmptyBlock) {
          contentBlocks.push(new _draftJs.ContentBlock({
            key: (0, _draftJs.genKey)(),
            text: text,
            type: block.type,
            characterList: characterMeta.toList(),
            depth: block.depth
          }));
        }
      });
      if (contentBlocks.length) {
        //console.log(convertToRaw(contentBlocks));
        return contentBlocks;
      } else {
        return [EMPTY_BLOCK];
      }
    }
  }, {
    key: 'getBlockTypeFromTagName',
    value: function getBlockTypeFromTagName(tagName) {
      switch (tagName) {
        case 'li':
          {
            var parent = this.blockStack.slice(-1)[0];
            return parent.tagName === 'ol' ? _main.BLOCK_TYPE.ORDERED_LIST_ITEM : _main.BLOCK_TYPE.UNORDERED_LIST_ITEM;
          }
        case 'blockquote':
          {
            return _main.BLOCK_TYPE.BLOCKQUOTE;
          }
        case 'h1':
          {
            return _main.BLOCK_TYPE.HEADER_ONE;
          }
        case 'h2':
          {
            return _main.BLOCK_TYPE.HEADER_TWO;
          }
        case 'h3':
          {
            return _main.BLOCK_TYPE.HEADER_THREE;
          }
        case 'h4':
          {
            return _main.BLOCK_TYPE.HEADER_FOUR;
          }
        case 'h5':
          {
            return _main.BLOCK_TYPE.HEADER_FIVE;
          }
        case 'h6':
          {
            return _main.BLOCK_TYPE.HEADER_SIX;
          }
        case 'pre':
          {
            return _main.BLOCK_TYPE.CODE;
          }
        default:
          {
            return _main.BLOCK_TYPE.UNSTYLED;
          }
      }
    }
  }, {
    key: 'processBlockElement',
    value: function processBlockElement(element) {
      var tagName = element.nodeName.toLowerCase();
      var type = this.getBlockTypeFromTagName(tagName);
      var hasDepth = canHaveDepth(type);
      var allowRender = !SPECIAL_ELEMENTS.hasOwnProperty(tagName);
      var block = {
        tagName: tagName,
        textFragments: [],
        type: type,
        styleStack: [NO_STYLE],
        entityStack: [NO_ENTITY],
        depth: hasDepth ? this.depth : 0
      };
      if (tagName === 'img') {
        var src = element.getAttribute('src');
        if (src != null) {
          var entityKey = _draftJs.Entity.create("TOKEN", 'MUTABLE', { src: src });
          block.entityStack = entityKey;
        }
      }
      if (allowRender) {
        this.blockList.push(block);
        if (hasDepth) {
          this.depth += 1;
        }
      }
      this.blockStack.push(block);
      if (element.childNodes != null) {
        Array.from(element.childNodes).forEach(this.processNode, this);
      }
      this.blockStack.pop();
      if (allowRender && hasDepth) {
        this.depth -= 1;
      }
    }
  }, {
    key: 'processInlineElement',
    value: function processInlineElement(element) {
      var tagName = element.nodeName.toLowerCase();
      if (tagName === 'br') {
        return this.processText('\r');
      }
      var block = this.blockStack.slice(-1)[0];
      var style = block.styleStack.slice(-1)[0];
      var entityKey = block.entityStack.slice(-1)[0];
      style = addStyleFromTagName(style, tagName);
      if (tagName === 'a') {
        var href = element.getAttribute('href');
        if (href != null) {
          entityKey = _draftJs.Entity.create(_main.ENTITY_TYPE.LINK, 'MUTABLE', { href: href });
        }
      }

      block.styleStack.push(style);
      block.entityStack.push(entityKey);
      if (element.childNodes != null) {
        Array.from(element.childNodes).forEach(this.processNode, this);
      }
      block.entityStack.pop();
      block.styleStack.pop();
    }
  }, {
    key: 'processTextNode',
    value: function processTextNode(node) {
      var text = node.nodeValue;
      // This is important because we will use \r as a placeholder.
      text = text.replace(LINE_BREAKS, '\n');
      // Replace zero-width space (used as a placeholder in markdown) with a
      // soft linebreak.
      text = text.split('\u200B').join('\r');
      this.processText(text);
    }
  }, {
    key: 'processText',
    value: function processText(text) {
      var block = this.blockStack.slice(-1)[0];
      var style = block.styleStack.slice(-1)[0];
      var entity = block.entityStack.slice(-1)[0];
      var charMetadata = _draftJs.CharacterMetadata.create({
        style: style,
        entity: entity
      });
      block.textFragments.push({
        text: text,
        characterMeta: (0, _immutable.Repeat)(charMetadata, text.length)
      });
    }
  }, {
    key: 'processImage',
    value: function processImage(text, element) {
      var tagName = element.nodeName.toLowerCase();
      var entityKey = void 0;
      if (tagName === 'img') {
        var src = element.getAttribute('src');
        if (src != null) {
          entityKey = _draftJs.Entity.create('TOKEN', 'MUTABLE', { src: src });
        }
      }
      var block = this.blockStack.slice(-1)[0];
      var style = block.styleStack.slice(-1)[0];
      var entity = entityKey;
      var charMetadata = _draftJs.CharacterMetadata.create({
        style: style,
        entity: entity
      });
      block.textFragments.push({
        text: text,
        characterMeta: (0, _immutable.Repeat)(charMetadata, text.length)
      });
    }
  }, {
    key: 'processNode',
    value: function processNode(node) {
      if (node.nodeType === _SyntheticDOM.NODE_TYPE_ELEMENT) {
        var element = node;
        var _tagName = element.nodeName.toLowerCase();
        if (INLINE_ELEMENTS.hasOwnProperty(_tagName)) {
          this.processInlineElement(element);
        } else {
          this.processBlockElement(element);
        }
      } else if (node.nodeType === _SyntheticDOM.NODE_TYPE_TEXT) {
        this.processTextNode(node);
      }
    }
  }]);

  return BlockGenerator;
}();

function trimLeadingNewline(text, characterMeta) {
  if (text.charAt(0) === '\n') {
    text = text.slice(1);
    characterMeta = characterMeta.slice(1);
  }
  return { text: text, characterMeta: characterMeta };
}

function trimLeadingSpace(text, characterMeta) {
  while (text.charAt(0) === ' ') {
    text = text.slice(1);
    characterMeta = characterMeta.slice(1);
  }
  return { text: text, characterMeta: characterMeta };
}

function trimTrailingSpace(text, characterMeta) {
  while (text.slice(-1) === ' ') {
    text = text.slice(0, -1);
    characterMeta = characterMeta.slice(0, -1);
  }
  return { text: text, characterMeta: characterMeta };
}

function collapseWhiteSpace(text, characterMeta) {
  text = text.replace(/[ \t\r\n]/g, ' ');

  var _trimLeadingSpace = trimLeadingSpace(text, characterMeta);

  text = _trimLeadingSpace.text;
  characterMeta = _trimLeadingSpace.characterMeta;

  var _trimTrailingSpace = trimTrailingSpace(text, characterMeta);

  text = _trimTrailingSpace.text;
  characterMeta = _trimTrailingSpace.characterMeta;

  var i = text.length;
  while (i--) {
    if (text.charAt(i) === ' ' && text.charAt(i - 1) === ' ') {
      text = text.slice(0, i) + text.slice(i + 1);
      characterMeta = characterMeta.slice(0, i).concat(characterMeta.slice(i + 1));
    }
  }
  return { text: text, characterMeta: characterMeta };
}

function canHaveDepth(blockType) {
  switch (blockType) {
    case _main.BLOCK_TYPE.UNORDERED_LIST_ITEM:
    case _main.BLOCK_TYPE.ORDERED_LIST_ITEM:
      {
        return true;
      }
    default:
      {
        return false;
      }
  }
}

function concatFragments(fragments) {
  var text = '';
  var characterMeta = (0, _immutable.Seq)();
  fragments.forEach(function (textFragment) {
    text = text + textFragment.text;
    characterMeta = characterMeta.concat(textFragment.characterMeta);
  });
  return { text: text, characterMeta: characterMeta };
}

function addStyleFromTagName(styleSet, tagName) {
  switch (tagName) {
    case 'b':
    case 'strong':
      {
        styleSet = styleSet.add(_main.INLINE_STYLE.BOLD);
        break;
      }
    case 'i':
    case 'em':
      {
        styleSet = styleSet.add(_main.INLINE_STYLE.ITALIC);
        break;
      }
    case 'ins':
      {
        styleSet = styleSet.add(_main.INLINE_STYLE.UNDERLINE);
        break;
      }
    case 'code':
      {
        styleSet = styleSet.add(_main.INLINE_STYLE.CODE);
        break;
      }
    case 'del':
      {
        styleSet = styleSet.add(_main.INLINE_STYLE.STRIKETHROUGH);
        break;
      }
  }
  return styleSet;
}

function stateFromElement(element) {
  var blocks = new BlockGenerator().process(element);
  return _draftJs.ContentState.createFromBlockArray(blocks);
}
module.exports = exports['default'];