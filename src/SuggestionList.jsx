import { useCallback } from 'react'; // Import useCallback hook
import { EditorState, Modifier } from 'draft-js'; // Import EditorState and Modifier
import "./SuggestionList.css";

const SuggestionList = ({ positions, spinTax, editorRef, setEditorState }) => {

    // const handleSuggestionSelect = useCallback(
    //     (suggestion) => {
    //         const currentEditorState = editorRef.current.getEditorState();
    //         const selection = currentEditorState.getSelection();
    //         const contentState = currentEditorState.getCurrentContent();
    //         const currentBlockKey = selection.getStartKey();
    //         const currentBlock = contentState.getBlockForKey(currentBlockKey);
    //         const currentOffset = selection.getStartOffset();
    //         const currentText = currentBlock.getText();

    //         // Get the text before and after the cursor position
    //         const textBeforeCursor = currentText.slice(0, currentOffset);
    //         const textAfterCursor = currentText.slice(currentOffset);

    //         // Combine the text with the selected suggestion
    //         const newText = `${textBeforeCursor}${suggestion}${textAfterCursor}`;

    //         // Create a new content state with the updated text
    //         const newContentState = Modifier.replaceText(
    //             contentState,
    //             selection.merge({ anchorOffset: 0, focusOffset: currentText.length }),
    //             newText
    //         );

    //         // Update the editor state with the new content state
    //         setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));

    //         // Hide the suggestion list after selecting a suggestion
    //         //   setShowSuggestions(false);
    //     },
    //     [editorRef, setEditorState]
    // );


    // const handleSuggestionSelect = useCallback(
    //     (suggestion) => {
    //         const currentEditorState = editorRef.current.getEditorState();
    //         const selection = currentEditorState.getSelection();
    //         const contentState = currentEditorState.getCurrentContent();
    //         const currentBlockKey = selection.getStartKey();
    //         const currentBlock = contentState.getBlockForKey(currentBlockKey);
    //         const currentOffset = selection.getStartOffset();
    //         const currentText = currentBlock.getText();

    //         // Find the index of the opening '{' character in the current line
    //         const openingBraceIndex = currentText.lastIndexOf('{', currentOffset);

    //         if (openingBraceIndex !== -1) {
    //             // Find the index of the closing '}' character after the opening '{' character
    //             const closingBraceIndex = currentText.indexOf('}', openingBraceIndex);

    //             if (closingBraceIndex !== -1) {
    //                 // Extract the text inside the curly brackets
    //                 const textInsideBrackets = currentText.substring(openingBraceIndex + 1, closingBraceIndex);

    //                 // Replace the text inside the curly brackets with the selected suggestion
    //                 const newText =
    //                     currentText.substring(0, openingBraceIndex + 1) +
    //                     suggestion +
    //                     currentText.substring(closingBraceIndex);

    //                 // Create a new content state with the updated text
    //                 const newContentState = Modifier.replaceText(
    //                     contentState,
    //                     selection.merge({
    //                         anchorOffset: openingBraceIndex,
    //                         focusOffset: closingBraceIndex + suggestion.length + 1, // Include the length of the selected suggestion
    //                     }),
    //                     newText
    //                 );

    //                 // Update the editor state with the new content state
    //                 setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));

    //                 // Hide the suggestion list after selecting a suggestion
    //                 // setShowSuggestions(false);
    //             }
    //         }
    //     },
    //     [editorRef, setEditorState]
    // );

    /**
     * ---- Handle Suggestion Select ----
     */
    const handleSuggestionSelect = useCallback(
        (suggestion) => {
            const currentEditorState = editorRef.current.getEditorState();
            const selection = currentEditorState.getSelection();
            const contentState = currentEditorState.getCurrentContent();
            const currentBlockKey = selection.getStartKey();
            const currentBlock = contentState.getBlockForKey(currentBlockKey);
            const currentOffset = selection.getStartOffset();
            const currentText = currentBlock.getText();

            // Find the index of the opening '{' character in the current line
            const openingBraceIndex = currentText.lastIndexOf('{', currentOffset);

            if (openingBraceIndex !== -1) {
                // Find the index of the closing '}' character after the opening '{' character
                const closingBraceIndex = currentText.indexOf('}', openingBraceIndex);

                if (closingBraceIndex !== -1) {
                    // Replace the text inside the curly brackets with the selected suggestion
                    const newText =
                        currentText.substring(0, openingBraceIndex + 1) +
                        suggestion +
                        currentText.substring(closingBraceIndex);

                    // Create a new content state with the updated text
                    const newContentState = Modifier.replaceText(
                        contentState,
                        selection.merge({
                            anchorOffset: openingBraceIndex,
                            focusOffset: closingBraceIndex + 1, // Include the length of the selected suggestion
                        }),
                        newText
                    );

                    console.log('New Content -- ', EditorState.push(currentEditorState, newContentState, 'insert-characters'));

                    // Update the editor state with the new content state
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                } else {
                    // If there is no closing '}' character, simply insert the selected suggestion at the cursor position
                    const newContentState = Modifier.insertText(contentState, selection, suggestion);
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                }
            }
        },
        [editorRef, setEditorState]
    );



    return (
        <>
            <div className="suggestion-list" style={{
                left: positions?.left,
                top: positions?.top,
            }}>
                <input
                    type="text"
                    placeholder="Search"
                    className="suggestion-search"
                />

                <div className="suggestion-scroll-list">
                    <ul>
                        {spinTax.length && spinTax.map((spin, index) => (
                            <li key={index} onClick={() => handleSuggestionSelect(spin)}>{spin}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SuggestionList;