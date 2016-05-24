import React, { Component } from 'react'
import MoreOptions from './MoreOptions'


  
const styles = {
	container: {
		position: 'absolute',
		left: 0,
		top: 0,
		zIndex: 999,
	}
}




export default class SideControl extends Component {

	static propTypes = {
		style: React.PropTypes.object,
		onImageClick: React.PropTypes.func,
		toggleBlockType: React.PropTypes.func,
		selectedBlockType: React.PropTypes.string,
	};

	state = {
		moreOptionsVisible: false, 
	};

	render = () => {
		return <div
			style={Object.assign({}, styles.container, this.props.style)}
		>
			
			<svg 
				style={{cursor: 'pointer'}}
				onMouseDown={(e) => e.preventDefault()}
				onClick={this.props.onImageClick}
				fill="#000000" height="19" viewBox="0 0 22.12 17.72" width="23" xmlns="http://www.w3.org/2000/svg">
			
			<g><path d="M1001.78,234.69a2.11,2.11,0,0,1,.64-1.55,2.21,2.21,0,0,1,1.57-.66h17.72a2.12,2.12,0,0,1,1.55.66,2.05,2.05,0,0,1,.64,1.55V248a2.14,2.14,0,0,1-.64,1.57,2.19,2.19,0,0,1-1.55.66H1004a2.08,2.08,0,0,1-1.55-.66,2.26,2.26,0,0,1-.66-1.57V234.69ZM1021.72,248V234.69H1004V248h17.72Zm-4.44-7.73a2.1,2.1,0,0,1,1.64,1.3,16.9,16.9,0,0,1,1.68,5.33H1005.1l0.36-1.1a7.51,7.51,0,0,1,1.17-2.23,2.27,2.27,0,0,1,1.81-1.08,6,6,0,0,1,2.68.81,2.39,2.39,0,0,0,1.19.3,2.73,2.73,0,0,0,1.83-1.17,9.63,9.63,0,0,1,2-1.81A2.3,2.3,0,0,1,1017.27,240.24Zm-11.05-1.68a2.76,2.76,0,1,1,2.76,2.76A2.44,2.44,0,0,1,1006.22,238.56Z" transform="translate(-1001.78 -232.48)"/></g></svg>
			<div 
				// style={{display: 'inline-block', cursor: 'pointer'}}
				style = {{display: 'none'}}
				onMouseOut={(e) => {
					this.setState({
						moreOptionsVisible: false,
					})
				}}
				onMouseOver={(e) => {
					this.setState({
						moreOptionsVisible: true,
					})
				}}
			>
				<svg 
					onMouseDown={(e) => e.preventDefault()}
					fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
			    <path d="M0 0h24v24H0z" fill="none"/>
			    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
				</svg>
				<MoreOptions 
					style={{
						// display: this.state.moreOptionsVisible ? 'block' : 'none',
						display : 'none',
					}}
					toggleBlockType={this.props.toggleBlockType}
					selectedBlockType={this.props.selectedBlockType}
				/>
			</div>
		</div>
	}
}
