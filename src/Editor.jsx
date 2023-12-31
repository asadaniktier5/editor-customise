import React, { useState, useRef } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './customStyle.css';
import { EditorState, convertToRaw, Modifier } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import SuggestionList from './SuggestionList';
import emogiIcon from './assets/emogi.svg';
import undoIcon from './assets/undo.svg';
import redoIcon from './assets/redo.svg';
import boldIcon from './assets/bold.svg';
import italicIcon from './assets/italic.svg';
import underlineIcon from './assets/underline.svg';


// .. Editor Suggestions List..
const spinTax = ['Hi', 'Hello', 'Dear', 'Hey', 'Greetings', 'Welcome'];
const mergeField = ['name', 'age', 'country', 'tier', 'status'];
const segment = ['Regards', 'Sincerely', 'Faithfully'];


// .. Plugin of Emoji..
const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;


const EditorComponent = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMergeSugggestions, setShowMergeSuggestions] = useState(false);
  const [showSegmentSuggestions, setShowSegmentSuggestions] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({ left: 0, top: 0 });
  const editorRef = useRef(null);


  /**
   * ==== The Toolbar Options ====
   */
  const toolbarOptions = {
    options: ['emoji', 'history', 'inline'],
    emoji: { icon: emogiIcon, className: 'emoji-icon', component: EmojiSelect },
    history: {
      options: ['undo', 'redo', 'separator'],
      undo: { icon: undoIcon, className: undefined },
      redo: { icon: redoIcon, className: undefined },
    },
    inline: {
      options: ['bold', 'italic', 'underline'],
      bold: { icon: boldIcon, className: undefined },
      italic: { icon: italicIcon, className: undefined },
      underline: { icon: underlineIcon, className: undefined },
    },
  };


  /**
   * ==== Handle Editor Change =====
   * @param {*} state 
   */
  const handleEditorChange = (state) => {
    const contentState = state.getCurrentContent();
    const selection = state.getSelection();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    const currentText = currentBlock.getText();
    const currentOffset = selection.getStartOffset();
    const currentChar = currentText.charAt(currentOffset - 1);


    //  //  console.log("comming::::::")
    //   const selection = window.getSelection();
    //   const range = selection.getRangeAt(0);
    //   const { top, left, height } = range.getBoundingClientRect();

    //   // Calculate the position of the popup
    //   const caretPosition = {
    //     top: top + height,
    //     left: left + 1,
    //   };

    //   setSuggestionPosition(caretPosition);


    // Check if the current character is an opening '{'
    // if (currentChar === '{') {
    //   setShowSuggestions(true);
    // } else {
    //   setShowSuggestions(false);
    // }

    // Update the editor state
    setEditorState(state);

    let differenceWithSingleBracket = false;

    // Check if the current charecter is two opening curly bracs '{{'..
    if (currentText.slice(currentOffset - 2, currentOffset) === '{{') {
      setShowSuggestions(false);
      setShowSegmentSuggestions(false);
      setShowMergeSuggestions(true);
      differenceWithSingleBracket = true;

    } else if (currentChar === '[') {
      setShowSuggestions(false);
      setShowMergeSuggestions(false);
      setShowSegmentSuggestions(true);

    } else if (currentChar === '{') {
      setShowSuggestions(true);
      setShowMergeSuggestions(false);
      setShowSegmentSuggestions(false);
      differenceWithSingleBracket = false;
    } else {
      setShowSuggestions(false);
      setShowMergeSuggestions(false);
      setShowSegmentSuggestions(false);
    }


    // Check if the current character is an opening '{{' and if the suggestion list is shown
    if (currentText.slice(currentOffset - 2, currentOffset) === '{{' && showMergeSugggestions && differenceWithSingleBracket) {
      // Automatically add '}' after inserting suggestion
      const newContentState = state.getCurrentContent();
      const newSelection = selection.merge({
        anchorOffset: currentOffset + 2,
        focusOffset: currentOffset + 2,

      });

      const newContentStateWithClosingBracket = Modifier.insertText(
        newContentState,
        newSelection,
        '}}'
      );

      const newEditorState = EditorState.push(state, newContentStateWithClosingBracket, 'insert-characters');
      setEditorState(newEditorState);

    }

    // Check if the current character is an opening '{' and if the suggestion list is shown
    if (currentChar === '{' && showSuggestions && !differenceWithSingleBracket) {
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

    // Check is the current character is with '|'..
    if (currentChar === '|') {
      setShowSuggestions(true);

      const newContentState = state.getCurrentContent();
      const newSelection = selection.merge({
        anchorOffset: currentOffset,
        focusOffset: currentOffset,
      });

      const newContentStateWithIndex = Modifier.insertText(newContentState, newSelection);
      const newEditorState = EditorState.push(state, newContentStateWithIndex, 'insert-characters');
      setEditorState(newEditorState);
    }

    // Check if the current character is an opening '[' and if the suggestion list is shown
    if (currentChar === '[' && showSegmentSuggestions) {
      // Automatically add '}' after inserting suggestion
      const newContentState = state.getCurrentContent();
      const newSelection = selection.merge({
        anchorOffset: currentOffset + 1,
        focusOffset: currentOffset + 1,
      });

      const newContentStateWithClosingBracket = Modifier.insertText(
        newContentState,
        newSelection,
        ']'
      );

      const newEditorState = EditorState.push(state, newContentStateWithClosingBracket, 'insert-characters');
      setEditorState(newEditorState);
    }
  };



  /**
   * ==== Handle Before Input ====
   * @param {*} _chars 
   * @param {*} editorState 
   * @returns 
   */
  const handleBeforeInput = (chars, editorState) => {
    // Check if the user typed '{'
    if (chars === '{' || chars === '{{' || chars === '[') {
      // const cursorPosition = editorState.getSelection().getAnchorOffset();
      // const editorRect = editorRef.current.getWrapperRef().getBoundingClientRect();

      // console.log("(Before Input) Editor Rect -- ", editorRect);

      // setSuggestionPosition({
      //   left: editorRect.left + cursorPosition * 7, // Adjust the value (15) based on your layout
      //   // top: editorRect.top + editorRect.height, // Adjust the value based on your layout
      //   top: editorRect.height,
      // });

      //  console.log("comming::::::")
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const { top, left, height } = range.getBoundingClientRect();

      console.log("SELECTING 2 -- ", selection);

      // Calculate the position of the popup
      const caretPosition = {
        top: top + height,
        left: left + 1,
      };

      setSuggestionPosition(caretPosition);

      // Move the cursor to the end of the text
      const newEditorState = EditorState.moveFocusToEnd(editorState);
      setEditorState(newEditorState);

      // console.log('Cursor Position:', cursorPosition);
      return 'not-handled';
    }

    // if (chars === '|') {
    //   // Move the cursor to the end of the text
    //   const newEditorState = EditorState.moveFocusToEnd(editorState);
    //   setEditorState(newEditorState);

    //   return 'not-handled';
    // }
  };



  /**
   * ==== Handle Clear All =====
   */
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
        plugins={[emojiPlugin]}
        wrapperClassName="editor-wrapper"
        editorClassName="editor-main"
        toolbarClassName="editor-toolbar"
      />

      <EmojiSuggestions />

      {showSuggestions && (
        <SuggestionList
          suggestions={spinTax}
          positions={{ left: suggestionPosition.left, top: suggestionPosition.top }}
          editorRef={editorRef}
          setEditorState={setEditorState}
          setShowSuggestions={setShowSuggestions}
        />
      )}

      {showMergeSugggestions && (
        <SuggestionList
          suggestions={mergeField}
          positions={{ left: suggestionPosition.left, top: suggestionPosition.top }}
          editorRef={editorRef}
          setEditorState={setEditorState}
          setShowSuggestions={setShowMergeSuggestions}
        />
      )}

      {showSegmentSuggestions && (
        <SuggestionList
          suggestions={segment}
          positions={{ left: suggestionPosition.left, top: suggestionPosition.top }}
          editorRef={editorRef}
          setEditorState={setEditorState}
          setShowSuggestions={setShowSegmentSuggestions}
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
