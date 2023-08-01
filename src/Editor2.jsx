import React, { useState, useRef } from 'react';
import { EditorState, convertToRaw, Modifier } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './customStyle.css';
import SuggestionList from './SuggestionList';
// import { AiOutlineBold } from 'react-icons/ai';
import boldIcon from './assets/bold.svg';
import italicIcon from './assets/italic.svg';
import underlineIcon from './assets/underline.svg';


// .. Editor Suggestions List..
const spinTax = ['Hi', 'Hello', 'Dear', 'Hey'];

const EditorComponent = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionPosition, setSuggestionPosition] = useState({ left: 0, top: 0 });
    const editorRef = useRef(null);


    const toolbarOptions = {
        options: ['emoji', 'inline', 'history'],
        inline: {
            options: ['bold', 'italic', 'underline'],
            bold: { icon: boldIcon, className: undefined },
            italic: { icon: italicIcon, className: undefined },
            underline: { icon: underlineIcon, className: undefined },
        },
        history: {
            options: ['undo', 'redo'],
        },
    };

    const handleEditorChange = (state) => {
        const contentState = state.getCurrentContent();
        const selection = state.getSelection();
        const currentBlock = contentState.getBlockForKey(selection.getStartKey());
        const currentText = currentBlock.getText();
        const currentOffset = selection.getStartOffset();
        const currentChar = currentText.charAt(currentOffset - 1);
      
        // Check if the current character is an opening '{'
        if (currentChar === '{') {
          setShowSuggestions(true);
          const editorRef = document.querySelector('.rdw-editor-main');
          const suggestionListRef = document.querySelector('.suggestion-list');
      
          if (editorRef && suggestionListRef) {
            const editorRect = editorRef.getBoundingClientRect();
            const suggestionRect = suggestionListRef.getBoundingClientRect();
      
            const cursorPosition = state.getSelection().getAnchorOffset();
            const { left, top } = editorRef
              .querySelector('.public-DraftEditor-content')
              .querySelector(`[data-offset-key="${currentBlock.getKey()}-0-0"]`)
              .getBoundingClientRect();
      
            const lineHeight = window.getComputedStyle(
              editorRef.querySelector('.public-DraftEditor-content')
            ).lineHeight;
            const lineHeightValue = parseFloat(lineHeight);
      
            const lines = currentText.split('\n');
            const currentLineIndex = lines.findIndex(
              (line) => line === currentText.substring(0, currentOffset)
            );
            const cursorLineTop =
              editorRect.top +
              lineHeightValue * currentLineIndex -
              editorRef.querySelector('.public-DraftEditor-content').scrollTop;
      
            setSuggestionPosition({
              left: left - editorRect.left + cursorPosition * 7, // Adjust the value (7) based on your layout
              top: cursorLineTop + lineHeightValue, // Adjust the value based on your layout
            });
          }
        } else {
          setShowSuggestions(false);
        }
      
        // Update the editor state
        setEditorState(state);
      
        // Check if the current character is an opening '{' and if the suggestion list is shown
        if (currentChar === '{' && showSuggestions) {
          // Automatically add '}' after inserting suggestion
          const newContentState = state.getCurrentContent();
          const newSelection = selection.merge({
            anchorOffset: currentOffset + 1,
            focusOffset: currentOffset + 1,
          });
          const newContentStateWithClosingBracket = Modifier.insertText(
            newContentState,
            newSelection,
            '}'
          );
          const newEditorState = EditorState.push(state, newContentStateWithClosingBracket, 'insert-characters');
          setEditorState(newEditorState);
        }
      };
      


    const handleBeforeInput = (_chars, editorState) => {
        const cursorPosition = editorState.getSelection().getAnchorOffset();
        const editorRect = editorRef.current.getWrapperRef().getBoundingClientRect();

        console.log("(Before Input) Editor Rect -- ", editorRect);

        setSuggestionPosition({
            left: editorRect.left + cursorPosition * 7, // Adjust the value (15) based on your layout
            // top: editorRect.top + editorRect.height, // Adjust the value based on your layout
            top: editorRect.height,
        });

        console.log('Cursor Position:', cursorPosition);
        return 'not-handled';
    };

    const handleClearAll = () => {
        setEditorState(EditorState.createEmpty());
    };


    return (
        <div>
            <h1>WYSIWYG Text Editor</h1>
            <Editor
                editorState={editorState}
                ref={editorRef}
                onEditorStateChange={handleEditorChange}
                handleBeforeInput={handleBeforeInput}
                toolbar={toolbarOptions}
                wrapperClassName="editor-wrapper"
                editorClassName="editor-main"
                toolbarClassName="editor-toolbar"
            />
            {showSuggestions && (
                <SuggestionList
                    positions={{ left: suggestionPosition.left, top: suggestionPosition.top }}
                    spinTax={spinTax}
                    editorRef={editorRef}
                    setEditorState={setEditorState}
                />
            )}

            {/* <SuggestionList /> */}

            <h2>Data Object Preview</h2>
            <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()))}</div>
            <button onClick={handleClearAll}>Clear All</button>
        </div>
    );
};

export default EditorComponent;