import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import SideControl from './SideControl';
import { Editor, EditorState, Entity, RichUtils, ContentState, CompositeDecorator, AtomicBlockUtils, convertFromRaw, convertToRaw } from 'draft-js';
import ImageComponent from '../components/ImageComponent';
const styles = {
  editorContainer: {
    position: 'relative',
    minHeight: 500,
    width: '100%',
    backgroundColor: '#fff',
  },
  sideControl: {

  }
}
export default class RichEditor extends Component {

  constructor(props) {
    super(props);
    window.addEventListener('scroll', this._scrollBar.bind(this));
    this.focus = () => this.refs.editor.focus();
    this.handleKeyCommand = (command) => this._handleKeyCommand(command);
    this.handleFileInput = (e) => this._handleFileInput(e);
    this.handleUploadImage = () => this._handleUploadImage();
    this.toggleBlockType = (type) => this._toggleBlockType(type);
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.insertImage = (file) => this._insertImage(file);
    this.state = {
      editorState: EditorState.createEmpty(),
    };
    this.onChange = (editorState) => {
      this.setState({
        editorState,
      });
    };
    this.blockRenderer = (block) => {
      if (block.getType() === 'atomic') {
        return {
          component: ImageComponent,
        };
      }
      return null;
    };
    this.blockStyler = (block) => {
      if (block.getType() === 'unstyled') {
        return 'paragraph';
      }
      return null;
    };

  }
  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }
  _scrollBar() {
    const scrollTop = document.body.scrollTop;
    const SideControlComp = this.refs.sideControl;
    const container = document.getElementById(this.props.documentId || 'app');
    const sideControloffsetTop = sideControloffsetTop || 0;
    const offsetTop = container.offsetTop;
    let sideControlStyles;
    if (scrollTop - offsetTop + sideControloffsetTop > 0) {
      sideControlStyles = {};
      const editorHeight = this.refs.hommilyEditor.clientHeight;
      const sliderHeight = ReactDOM.findDOMNode(SideControlComp).clientHeight;
      if (scrollTop - offsetTop - editorHeight + sliderHeight + sideControloffsetTop > 0) {
        sideControlStyles.bottom = 0;
        sideControlStyles.position = 'absolute';
      } else {
        sideControlStyles.top = sideControloffsetTop;
        sideControlStyles.position = 'fixed';
      }
      this.setState({
        sideControlStyles,
      });
    } else {
      sideControlStyles = {
        position: 'absolute',
        top: 0,
      };
      this.setState({
        sideControlStyles,
      });
    }
  }
  _toggleBlockType(blockType) {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }
  _insertImage(file) {
    const  fileSrc =  typeof file == "object" ? URL.createObjectURL(file) : file;
    const entityKey = Entity.create('atomic', 'IMMUTABLE', {
      src: fileSrc,
    });
    this.onChange(AtomicBlockUtils.insertAtomicBlock(
      this.state.editorState,
      entityKey,
      ' '
    ));
  }

  _handleFileInput(e) {
    const fileList = e.target.files;
    const file = fileList[0];

    if ( (typeof this.props.uploadImg) != "undefined" && (typeof this.props.uploadImg) == "function" ){
      this.props.uploadImg(file,this.insertImage)
      return
    }
    this.insertImage(file);
  }
  _handleUploadImage() {
    this.refs.fileInput.click();
  }
  getFirstBlockText() {
    const currentContentState = this.getCurrentContent();
    const blocksArray = currentContentState.getBlocksAsArray();
    let _text = null;
    for (let i = 0; i < blocksArray.length; i++) {
      if (blocksArray[i].getText().length > 0) {
        _text = blocksArray[i].getText();

        break;
      }
    }
    return _text;
  }
  getContent() {
    const content = this.state.editorState.getCurrentContent()
    return convertToRaw(content)
  };
  getEditorState() {

    return this.state.editorState;
  }
  getCurrentContent() {

    return this.state.editorState.getCurrentContent();
  }
    componentWillUnmount() {
       window.removeEventListener('scroll', this._scrollBar.bind(this));
  }
  render() {
    const editorState = this.state.editorState;
    const currentInlineStyle = editorState.getCurrentInlineStyle();
    const selection = editorState.getSelection();
    const selectedBlockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
    const sideControlStyles = Object.assign({}, styles.sideControl, this.state.sideControlStyles);
    let className = 'RichEditor-editor';
    return (
      <div ref="hommilyEditor" style={Object.assign({}, styles.editorContainer, this.props.style)}
      className="RichEditor" onClick={this.focus}>
        <SideControl style={sideControlStyles}
      onImageClick={this.props.onImageClick
      // This editor will support a real basic example of inserting an image
      // into the page, just so something works out the box.
      || ((e) => this.refs['fileInput'].click())
      }
      toggleBlockType={this.toggleBlockType}
      selectedBlockType={selectedBlockType}
      toggleInlineStyle={this.toggleInlineStyle}
      currentInlineStyle={currentInlineStyle}
      onEditorChange={this.onChange}
      EditorState ={EditorState}
      editorState={this.state.editorState}
      ref="sideControl"
      />
        <div className={className}>


        <Editor
      blockRendererFn={this.blockRenderer}
      blockStyleFn={this.blockStyler}
      editorState={editorState}
      handleKeyCommand={this.handleKeyCommand}
      onChange={this.onChange}
      placeholder="Write something..."
      // readOnly={this.state.editingImage}
      ref="editor"
      />
         </div>
        <input type="file" ref="fileInput" style={{
        display: 'none'
      }}
      onChange={this.handleFileInput} />
      </div>

      );
  }
}
