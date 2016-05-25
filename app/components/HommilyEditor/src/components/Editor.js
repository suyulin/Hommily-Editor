import Draft from 'draft-js';
import {Map} from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent'
import MediaComponent from './MediaComponent';
import insertMediaBlock from '../modifiers/insertMediaBlock';
import removeMediaBlock from '../modifiers/removeMediaBlock';
import SideControl from './SideControl';
import PopoverControl from './PopoverControl/PopoverControl'
import generateUniqueType from './../lib/generateUniqueType.js'
import Image from './Image.js'
import MediaWrapper from './MediaWrapper.js'

var {ContentState, Editor, EditorState, RichUtils, Entity, 
  CompositeDecorator, convertFromRaw, convertToRaw} = Draft;


var getSelectedBlockElement = (range) => {
  var node = range.startContainer
  do {
    if (node.getAttribute && node.getAttribute('data-block') == 'true')
      return node
    node = node.parentNode
  } while (node != null)
  return null
  /*const currentContent = this.state.editorState.getCurrentContent()
  const selection = this.state.editorState.getSelection()
  return currentContent.getBlockForKey(selection.getStartKey())*/
};

var getSelectionRange = () => {
  var selection = window.getSelection()
  if (selection.rangeCount == 0) return null
  return selection.getRangeAt(0)
};

function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props) => {
  const {href} = Entity.get(props.entityKey).getData();
  return (
    <a href={href} style={styles.link}>
      {props.children}
    </a>
  );
};

const styles = {
  editorContainer: {
    position: 'relative',
    minHeight: 500,
    width: '100%',
    backgroundColor:'#fff',
   
    //paddingLeft: 48,
  },
  popOverControl: {
   // Height and width are needed to compute the position
    width: 6*24+30,
    height: 26,
    display: 'none', 
    top: 0,
    left: 0,
    position: 'absolute',
    zIndex: 998,
    borderRadius: 26,
    backgroundColor: 'rgb(255, 255, 255)',
    boxShadow: '0px 0px 3px rgba(0,0,0,0.15)',
    padding: '0 15px',
  },
  sideControl: {
   
    //width: 48, // Needed to figure out how much to offset the sideControl left
  
    display: 'none',
  }
}

const popoverSpacing = 3 // The distance above the selection that popover 
  // will display

export default class RichEditor extends React.Component {

  static propTypes = {
    blockTypes: React.PropTypes.object,
  };

  static defaultProps = {
    blockTypes: {
      'image': Image,
    },
  };

  constructor(props) {
    super(props);

    uploadImage =  this.insertBlockComponent;
    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    var editorState = null
    if (this.props.editorState){
      eidtorState = editorState
    } else if (this.props.content){
      const blocks = convertFromRaw(this.props.content);
      editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(blocks), 
        decorator
      )
    } else {
      editorState = EditorState.createEmpty(decorator)
    }

    this.state = {
      editorState,
      liveTeXEdits: Map(),
    };

    this._blockRenderer = (block) => {

      var type = block.getType()

      var Component = this.props.blockTypes[type]

      if (Component){
        return {
          component: MediaWrapper,
          props: {
            child: <Component />,
          }
        }
      }
      return null;
    };

    this._focus = () => {
      var editorBounds = ReactDOM.findDOMNode(this.refs['editor']).getBoundingClientRect()
      this.setState({
        editorBounds,
      })
      this.refs.editor.focus();
    };
    this._onChange = (editorState) => {
      
      this.setState({
        editorState,
      })

      // Calling this right away doesn't always seem to be reliable. It 
      // sometimes selects the first block when the user has focus on a block
      // later on in the series. Although setting the state twice is less than
      // ideal
      setTimeout(this.updateSelection, 4)

      if (this.props.onChange){
        this.props.onChange()
      }
    };

    this.updateSelection = () => {
      var selectionRangeIsCollapsed = null,
        sideControlVisible = false,
        sideControlTop = null,
        sideControlLeft = styles.sideControl.left,
        popoverControlVisible = false,
        popoverControlTop = null,
        popoverControlLeft = null
      
      let selectionRange = getSelectionRange();
      // let _v = selectionRange.getClientRects();
      // sideControlLeft = _v.ClientRect.left;
      if (selectionRange){
        let rangeBounds = selectionRange.getBoundingClientRect()
        var selectedBlock = getSelectedBlockElement(selectionRange)
        if (selectedBlock){
          var blockBounds = selectedBlock.getBoundingClientRect()

          sideControlVisible = true
          //sideControlTop = this.state.selectedBlock.offsetTop
          var editorBounds = this.state.editorBounds

          var sideControlTop = (blockBounds.top - editorBounds.top)
            + ((blockBounds.bottom - blockBounds.top) / 2)
            // - (styles.sideControl.height / 2)
        }

      }
      
      this.setState({
        sideControlVisible,
        sideControlTop,
        sideControlLeft,
        popoverControlVisible,
        popoverControlTop,
        popoverControlLeft,
      });
    };
    

    this._handleKeyCommand = command => {
      var {editorState} = this.state;
      var newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        this._onChange(newState);
        return true;
      }
      return false;
    };

    this._removeTeX = (blockKey) => {
      var {editorState, liveTeXEdits} = this.state;
      this.setState({
        liveTeXEdits: liveTeXEdits.remove(blockKey),
        editorState: removeMediaBlock(editorState, blockKey),
      });
    };
  };

  componentWillReceiveProps = (props) => {
    if (props.editorState){
      this.setState({
        editorState: props.editorState,
      })
    }
  };


  // This editor will support a real basic example of inserting an image
  // into the page, just so something works out the box.
  handleFileInput = (e) => {

    var files = Array.prototype.slice.call(e.target.files, 0)[0];
    //上传图片
     this.props.uploadImg(files,(src)=>{
      this.insertBlockComponent("image", {src:src});
     });


    // files.forEach(f => 
    //   this.insertBlockComponent("image", {src: URL.createObjectURL(f)}))
  };

  toggleBlockType = (blockType) => {
    this.onEditorChange(
      RichUtils.toggleBlockType(this.state.editorState, blockType));

    setTimeout(this.updateSelection, 4)
  };

  toggleInlineStyle = (style) => {
    if (style != 'LINK'){
      return this.onEditorChange(
        RichUtils.toggleInlineStyle(this.state.editorState, style));
    }

    // Add a link
    const selection = this.state.editorState.getSelection();
    if (selection.isCollapsed()) {
      return;
    }
    const href = window.prompt('Enter a URL');
    const entityKey = Entity.create('LINK', 'MUTABLE', {href});
    const content = this.state.editorState.getCurrentContent();   
    this.onEditorChange(
      RichUtils.toggleLink(this.state.editorState, selection, entityKey))

  };

  onEditorChange = (editorState) => {
 
    this.setState({editorState});
  };
  getFirstBlockText =() =>{
      const currentContentState = this.getCurrentContent();
      //const cs = new  ContentState(contentBlock);
     const blocksArray =  currentContentState.getBlocksAsArray();
     let _text = null;
     for(let i = 0;i<blocksArray.length;i++){
       if (blocksArray[i].getText().length > 0) {
          _text = blocksArray[i].getText();

          break;
       }
     }
     return _text;
  }
  getContent = () => {
    const content = this.state.editorState.getCurrentContent()
    return convertToRaw(content)
  };
  getEditorState =()=>{
    
    return this.state.editorState;
  }
  getCurrentContent =() =>{

    return this.state.editorState.getCurrentContent();
  }

  insertBlock = (type, data) => {
    var editorState = insertMediaBlock(this.state.editorState, type, data)
    this.setState({
      editorState,
    })
  };

  clearState = () => {
    this.setState({
      editorState:EditorState.createEmpty(this.state.editorState.decorator)
    })
  }
  insertBlockComponent = (type, data) => {

    // TODO cerate a componnet pool with type
    //var type = generateUniqueType()
    
    var editorState = insertMediaBlock(this.state.editorState, type, data)
    this.setState({
      editorState,
    })
  };

  /**
   * While editing TeX, set the Draft editor to read-only. This allows us to
   * have a textarea within the DOM.
   */
  render() {

    var editorState = this.state.editorState
    var currentInlineStyle = editorState.getCurrentInlineStyle();

    const selection = editorState.getSelection();
    const selectedBlockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    var sideControlStyles = Object.assign({}, styles.sideControl)
    if (this.state.sideControlVisible){
      sideControlStyles.display = 'block'
      sideControlStyles.top = this.state.sideControlTop
      sideControlStyles.left = this.state.sideControlLeft
    }

    var popoverStyles = Object.assign({}, styles.popOverControl)
    if (this.state.popoverControlVisible){
      popoverStyles.display = 'block'
      popoverStyles.top = this.state.popoverControlTop
      popoverStyles.left = this.state.popoverControlLeft
    }

    return (
      <div style={Object.assign({}, styles.editorContainer, this.props.style)} 
        className="TeXEditor-editor" onClick={this._focus}>
        <SideControl style={sideControlStyles} 
          onImageClick={this.props.onImageClick
          // This editor will support a real basic example of inserting an image
          // into the page, just so something works out the box. 
            || ((e) => this.refs['fileInput'].click())}
          toggleBlockType={type => this.toggleBlockType(type)}
          selectedBlockType={selectedBlockType}
          toggleInlineStyle={style => this.toggleInlineStyle(style)}
          currentInlineStyle={currentInlineStyle}
          onEditorChange={this.onEditorChange}
          EditorState ={EditorState}
          editorState={this.state.editorState}
        />
        <PopoverControl 
          style={popoverStyles} 
          toggleInlineStyle={style => this.toggleInlineStyle(style)}
          currentInlineStyle={currentInlineStyle}
          toggleBlockType={type => this.toggleBlockType(type)}
          selectedBlockType={selectedBlockType}
           editorState={this.state.editorState}
        />
        <Editor

          blockRendererFn={this._blockRenderer}
          editorState={this.state.editorState}
          handleKeyCommand={this._handleKeyCommand}
          onChange={this._onChange}
          placeholder={this.props.placeholder}
          readOnly={this.state.liveTeXEdits.count()}
          ref="editor"
        />
        <input type="file" ref="fileInput" style={{display: 'none'}} 
          onChange={this.handleFileInput} />
      </div>
        
    );
  }
}
