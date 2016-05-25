import React, { Component } from 'react';
import styles from './SideControl.css';

export default class SideControl extends Component {

	static propTypes = {
		style: React.PropTypes.object,
		onImageClick: React.PropTypes.func,
		toggleBlockType: React.PropTypes.func,
		selectedBlockType: React.PropTypes.string,
		toggleInlineStyle: React.PropTypes.func,
		currentInlineStyle: React.PropTypes.object,
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
		return <div className={styles.container}
			style={this.props.style}
		
		>
			<div className={styles.imgIsabled} onMouseDown={this.props.onImageClick}>
			</div>
			<div 
			    className={this.props.currentInlineStyle 
						&& this.props.currentInlineStyle.has('BOLD') 
					 	? styles.boldSelected : styles.boldIsabled}
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
					 	? styles.italicSelected : styles.italicIsabled}
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
					 	? styles.titleSelected : styles.titleIsabled}
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
					 	? styles.ulSelected : styles.ulIsabled}
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
					 	? styles.olSelected : styles.olIsabled}
                onMouseDown ={
                	(e) => {
					e.preventDefault()
				 this.toggleBlockType('ordered-list-item')
				}
			}

			>
			</div>
			
		
			<div className={styles.undoIsabled} onMouseDown={(e)=>{
				e.preventDefault();
				this.props.onEditorChange(this.props.EditorState.undo(this.props.editorState));
			}}  >
			</div>
				<div className={styles.redoIsabled} onMouseDown={(e)=>{
				e.preventDefault();
				this.props.onEditorChange(this.props.EditorState.redo(this.props.editorState));
			}}>
			</div>
			
			
		</div>
	}
}
