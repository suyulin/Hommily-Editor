import React, { Component } from 'react'

export default class Image extends Component {

	render = () => {
		return <div
      contentEditable={false}>
      <img src={this.props.src} />
    </div>
	}
}