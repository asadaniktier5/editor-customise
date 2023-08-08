import { useCallback, useState } from 'react'; // Import useCallback hook
import { EditorState, Modifier } from 'draft-js'; // Import EditorState and Modifier
import "./SuggestionList.css";
import SearchIcon from './assets/search';


const SuggestionList = ({ positions, suggestions, editorRef, setEditorState, setShowSuggestions }) => {
    const [spinTaxData, setSpinTaxData] = useState([...suggestions]);

    /**
     * ===== Handle Suggestion Select with different brackets here =====
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

            // Find the index of the opening character in the current line
            const openingBraceIndex = currentText.lastIndexOf('{', currentOffset);
            const openingDoubleBraceIndex = currentText.lastIndexOf('{{', currentOffset);
            const openingAngleBraceIndex = currentText.lastIndexOf('[', currentOffset);
            let closingBrace = null;

            
            if (openingBraceIndex !== -1) {
                closingBrace = '}';
                // Find the index of the closing '}' character after the opening '{' character.
                const closingBraceIndex = currentText.indexOf('}', openingBraceIndex);

                if (closingBraceIndex !== -1) {
                    // Replace the text inside the curly brackets with the selected suggestion
                    const newText = currentText.substring(openingBraceIndex + 1, closingBraceIndex - 1) + suggestion + currentText.substring(closingBraceIndex);
                    // const newText2 = currentText.substring(openingBraceIndex + closingBrace.length, closingBraceIndex) + suggestion + currentText.substring(closingBraceIndex + closingBrace.length);

                    // Create a new content state with the updated text
                    const newContentState = Modifier.replaceText(
                        contentState,
                        selection.merge({
                            anchorOffset: openingBraceIndex,
                            focusOffset: closingBraceIndex + closingBrace.length + suggestion.length,
                        }),
                        newText
                    );

                    console.log("New Text -- ", newText);
                    console.log("making starting { : ", currentText.substring(openingBraceIndex + 1, closingBraceIndex - 1));
                    console.log("ending with } : ", currentText.substring(closingBraceIndex));

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
                    setEditorState(finalEditorState);
                }
            }


            if (openingAngleBraceIndex !== -1) {
                closingBrace = ']';
                // Find the index of the closing ']' character after the opening '[' character.
                const closingAngelBraceIndex = currentText.indexOf(']', openingAngleBraceIndex);

                if (closingAngelBraceIndex !== -1) {
                    // Replace the text inside the curly brackets with the selected suggestion
                    const newText = currentText.substring(openingAngleBraceIndex + 1, closingAngelBraceIndex - 1) + suggestion + currentText.substring(closingAngelBraceIndex);

                    // Create a new content state with the updated text
                    const newContentState = Modifier.replaceText(
                        contentState,
                        selection.merge({
                            anchorOffset: openingAngleBraceIndex,
                            focusOffset: closingAngelBraceIndex + closingBrace.length + suggestion.length,
                        }),
                        newText
                    );

                    console.log("New Text -- ", newText);
                    console.log("making starting [ : ", currentText.substring(openingAngleBraceIndex + 1, closingAngelBraceIndex - 1));
                    console.log("ending with ] : ", currentText.substring(closingAngelBraceIndex));

                    // Update the editor state with the new content state
                    const newEditorState = EditorState.push(currentEditorState, newContentState, 'insert-characters');
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                    setShowSuggestions(false);

                    // Move the cursor to the end of the text..
                    const finalEditorState = EditorState.moveFocusToEnd(newEditorState);
                    setEditorState(finalEditorState);

                } else {
                    // If there is no closing ']' character, simply insert the selected suggestion at the cursor position
                    const newContentState = Modifier.insertText(contentState, selection, suggestion);
                    const newEditorState = EditorState.push(currentEditorState, newContentState, 'insert-characters');
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                    setShowSuggestions(false);

                    // Move the cursor to the end of the text..
                    const finalEditorState = EditorState.moveFocusToEnd(newEditorState);
                    setEditorState(finalEditorState);
                }
            }


            if (openingDoubleBraceIndex !== -1) {
                closingBrace = '}}';
                // Find the index of the closing '}}' character after the opening '{{' character.
                const closingDoubleBraceIndex = currentText.indexOf('}}', openingDoubleBraceIndex);

                if (closingDoubleBraceIndex !== -1) {
                    // Replace the text inside the curly brackets with the selected suggestion
                    const newText = currentText.substring(openingDoubleBraceIndex + 1, closingDoubleBraceIndex - 1) + suggestion + currentText.substring(closingDoubleBraceIndex);

                    // Create a new content state with the updated text
                    const newContentState = Modifier.replaceText(
                        contentState,
                        selection.merge({
                            anchorOffset: openingDoubleBraceIndex,
                            focusOffset: closingDoubleBraceIndex + closingBrace.length + suggestion.length,
                        }),
                        newText
                    );

                    console.log("New Text -- ", newText);
                    console.log("making starting {{ : ", currentText.substring(openingDoubleBraceIndex + 1, closingDoubleBraceIndex - 1));
                    console.log("ending with }} : ", currentText.substring(closingDoubleBraceIndex));

                    // Update the editor state with the new content state
                    const newEditorState = EditorState.push(currentEditorState, newContentState, 'insert-characters');
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                    setShowSuggestions(false);

                    // Move the cursor to the end of the text..
                    const finalEditorState = EditorState.moveFocusToEnd(newEditorState);
                    setEditorState(finalEditorState);

                } else {
                    // If there is no closing '}}' character, simply insert the selected suggestion at the cursor position
                    const newContentState = Modifier.insertText(contentState, selection, suggestion);
                    const newEditorState = EditorState.push(currentEditorState, newContentState, 'insert-characters');
                    setEditorState(EditorState.push(currentEditorState, newContentState, 'insert-characters'));
                    setShowSuggestions(false);

                    // Move the cursor to the end of the text..
                    const finalEditorState = EditorState.moveFocusToEnd(newEditorState);
                    setEditorState(finalEditorState);
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


    return (
        <>
            <div className="suggestion-list" style={{
                left: positions?.left,
                top: positions?.top,
            }}>

                <div className='suggestion-search'>
                    <SearchIcon width={18} height={18} />
                    <input
                        type="text"
                        placeholder="Search"
                        className="suggestion-searchbar"
                        onChange={handleSearchChange}
                    />
                </div>

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