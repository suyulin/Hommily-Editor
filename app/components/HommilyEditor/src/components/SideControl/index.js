import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class SideControl extends Component {

	static propTypes = {
		style: PropTypes.object,
		onImageClick: PropTypes.func,
		toggleBlockType: PropTypes.func,
		selectedBlockType: PropTypes.string,
		toggleInlineStyle: PropTypes.func,
		currentInlineStyle: PropTypes.object,
	};
   	toggleInlineStyle (style) {
		if (this.props.toggleInlineStyle)
			this.props.toggleInlineStyle(style)
	}

	toggleBlockType(blockType){
		if (this.props.toggleBlockType)
			this.props.toggleBlockType(blockType)
	}
	render(){
		return (<div className="container" style={this.props.style}>
			<div className="imgIsabled"  onMouseDown={e => e.preventDefault()} onClick={this.props.onImageClick}>
			</div>
			<div
			    className={this.props.currentInlineStyle
						&& this.props.currentInlineStyle.has('BOLD')
					 	? "boldSelected" : "boldIsabled"}
                onMouseDown ={
                	(e) => {
					e.preventDefault()
				 this.toggleInlineStyle('BOLD')
				}
			}
						>
			</div>
			<div
              className={this.props.currentInlineStyle
						&& this.props.currentInlineStyle.has('ITALIC')
					 	? "italicSelected" : "italicIsabled"}
                onMouseDown ={
                	(e) => {
					e.preventDefault()
				 this.toggleInlineStyle('ITALIC')
				}
			}
			>
			</div>
			<div
               className={this.props.selectedBlockType === 'header-two'
					 	? "titleSelected" : "titleIsabled"}
                onMouseDown ={
                	(e) => {
					e.preventDefault()
				 this.toggleBlockType('header-two')
				}
			}
			>
			</div>
			<div
           className={this.props.selectedBlockType === 'unordered-list-item'
					 	? "ulSelected" : "ulIsabled"}
                onMouseDown ={
                	(e) => {
					e.preventDefault()
				 this.toggleBlockType('unordered-list-item')
				}
			}

			>
			</div>
			<div
                className={this.props.selectedBlockType === 'ordered-list-item'
					 	? "olSelected" : "olIsabled"}
                onMouseDown ={
                	(e) => {
					e.preventDefault()
				 this.toggleBlockType('ordered-list-item')
				}
			}

			>
			</div>


			<div className="undoIsabled" onMouseDown={(e)=>{
				e.preventDefault();
				this.props.onEditorChange(this.props.EditorState.undo(this.props.editorState));
			}}  >
			</div>
				<div className="redoIsabled" onMouseDown={(e)=>{
				e.preventDefault();
				this.props.onEditorChange(this.props.EditorState.redo(this.props.editorState));
			}}>
			</div>


		</div>)
	}
}
