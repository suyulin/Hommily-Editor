# Hommily-Editor

一款基于 facebook 开源项目Draft.js 的react 富文本编辑器

#支持

站在巨人的肩膀上   
https://github.com/facebook/draft-js   
https://github.com/andrewcoelho/react-text-editor   
https://draftjs-examples.herokuapp.com/   
基于以上构建项目   

#示例
访问 http://suyulin.github.io/Hommily-Editor

# 安装
    $ npm install hommilyeditor --save   

# 使用
```javascript
import React, { Component, PropTypes } from 'react';
import HommilyEditor from 'HommilyEditor';
class Test extends Component {

  constructor(props, context) {
    super(props, context);
    this.click = this.click.bind(this);
  }
  click(){
  	const editor = this.refs.editor;

  	console.log(editor.getFirstBlockText()) 拿第一段文本
  	console.log(editor.getPlainText()) 拿到纯文本
  	console.log(editor.saveHandle()) 拿到编辑器html内容
 	//const  html = ""; 这里必须是 editor.saveHandle() 的返回值
  	//editor.editHandle(html) 从html内容恢复编辑器内容
   //editor.onFocus()  得到焦点
  }
  uploadImg(file,callback) {
  // file 是 inputfile对象 需要上传以后，拿到 图片的url 传给callback
  	 const fileUrl = "http://tupian.enterdesk.com/2013/lxy/12/9/3/1.jpg"
  	 callback(fileUrl)
  }
  render() {
    return <div> <HommilyEditor ref="editor" uploadImg = {this.uploadImg} /> <button onClick={this.click}>点我呀</button> </div>;
  }
}
export default Test;

```
