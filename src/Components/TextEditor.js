import React, { Component } from 'react';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "./TextEditor.css";

class TextEditor extends React.Component {

    render(){
        return <div className="editor-box">
                <Editor
                    editorState={this.props.editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={this.props.onEditorStateChange}
                />
                {/* <textarea disabled value={} /> */}
        </div>
    }
}

export default TextEditor;