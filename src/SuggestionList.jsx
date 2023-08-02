import { useCallback, useState } from 'react'; // Import useCallback hook
import { EditorState, Modifier } from 'draft-js'; // Import EditorState and Modifier
import "./SuggestionList.css";

const SuggestionList = ({ positions, spinTax, editorRef, setEditorState, setShowSuggestions }) => {
    const [spinTaxData, setSpinTaxData] = useState([...spinTax]);

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
                    const newText = currentText.substring(openingBraceIndex + 1, closingBraceIndex - 1) + suggestion + currentText.substring(closingBraceIndex);

                    console.log("New TEXT -- ", newText);

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
                    const newEditorState = EditorState.push(currentEditorState, newContentState, 'insert-characters');
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                    setShowSuggestions(false);

                    // Move the cursor to the end of the text..
                    const finalEditorState = EditorState.moveFocusToEnd(newEditorState);
                    setEditorState(finalEditorState);

                } else {
                    // If there is no closing '}' character, simply insert the selected suggestion at the cursor position
                    const newContentState = Modifier.insertText(contentState, selection, suggestion);
                    const newEditorState = EditorState.push(currentEditorState, newContentState, 'insert-characters');
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                    setShowSuggestions(false);


                    // Move the cursor to the end of the text..
                    const finalEditorState = EditorState.moveFocusToEnd(newEditorState);
                }
            }
        },
        [editorRef, setEditorState]
    );


    /**
     * ==== Handle the search of suggestion list ====
     * @param {*} event 
     */
    const handleSearchChange = (event) => {
        const { value } = event.target;
        const filteredSpinTaxData = spinTaxData.filter(spin => spin.toLowerCase() === value.toLowerCase());
        setSpinTaxData(filteredSpinTaxData);
    };

    console.log(spinTaxData);


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
                    onChange={handleSearchChange}
                />

                <div className="suggestion-scroll-list">
                    <ul>
                        {spinTaxData.length && spinTaxData.map((spin, index) => (
                            <li key={index} onClick={() => handleSuggestionSelect(spin)}>{spin}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default SuggestionList;