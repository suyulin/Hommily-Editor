/**
 * Copyright (c) 2013-present, Facebook, Inc. All rights reserved.
 *
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = insertMediaBlock;

var _immutable = require('immutable');

var _draftJs = require('draft-js');

var count = 0;
var examples = ['\\int_a^bu\\frac{d^2v}{dx^2}\\,dx\n' + '=\\left.u\\frac{dv}{dx}\\right|_a^b\n' + '-\\int_a^b\\frac{du}{dx}\\frac{dv}{dx}\\,dx', 'P(E) = {n \\choose k} p^k (1-p)^{ n-k} ', '\\tilde f(\\omega)=\\frac{1}{2\\pi}\n' + '\\int_{-\\infty}^\\infty f(x)e^{-i\\omega x}\\,dx', '\\frac{1}{(\\sqrt{\\phi \\sqrt{5}}-\\phi) e^{\\frac25 \\pi}} =\n' + '1+\\frac{e^{-2\\pi}} {1+\\frac{e^{-4\\pi}} {1+\\frac{e^{-6\\pi}}\n' + '{1+\\frac{e^{-8\\pi}} {1+\\ldots} } } }'];

function insertMediaBlock(editorState, type, data) {

  var contentState = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();

  var afterRemoval = _draftJs.Modifier.removeRange(contentState, selectionState, 'backward');

  var targetSelection = afterRemoval.getSelectionAfter();
  var afterSplit = _draftJs.Modifier.splitBlock(afterRemoval, targetSelection);
  var insertionTarget = afterSplit.getSelectionAfter();

  var asMedia = _draftJs.Modifier.setBlockType(afterSplit, insertionTarget, type);

  var entityKey = _draftJs.Entity.create('TOKEN', 'IMMUTABLE', data);

  var charData = _draftJs.CharacterMetadata.create({ entity: entityKey });

  var fragmentArray = [new _draftJs.ContentBlock({
    key: (0, _draftJs.genKey)(),
    type: type,
    text: ' ',
    characterList: (0, _immutable.List)((0, _immutable.Repeat)(charData, 1))
  }), new _draftJs.ContentBlock({
    key: (0, _draftJs.genKey)(),
    type: 'unstyled',
    text: '',
    characterList: (0, _immutable.List)()
  })];

  var fragment = _draftJs.BlockMapBuilder.createFromArray(fragmentArray);

  var withMedia = _draftJs.Modifier.replaceWithFragment(asMedia, insertionTarget, fragment);

  var newContent = withMedia.merge({
    selectionBefore: selectionState,
    selectionAfter: withMedia.getSelectionAfter().set('hasFocus', true)
  });

  return _draftJs.EditorState.push(editorState, newContent, 'insert-fragment');
}
module.exports = exports['default'];