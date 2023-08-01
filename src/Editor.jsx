// API KEY = 70lhuo6kmkentf7qfp1hcdpg2yc0yg6yt5yqq2clr4ofhwyv
import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import customSuggestionPlugin from './customSuggestionPlugin';

// Editor Component..
const MyEditor = () => {
    const [content, setContent] = useState('');
    const editorRef = useRef(null);

    useEffect(() => {
        console.log("Editor REF -- ", editorRef.current);
        
        if (editorRef.current && editorRef.current.editor) {
            // Attach the custom suggestion plugin once the editor is initialized
            customSuggestionPlugin(editorRef.current.editor);
          }
    }, []);

    const handleEditorChange = (content, editor) => {
        setContent(content);
    };

    return (
        <Editor
            apiKey="70lhuo6kmkentf7qfp1hcdpg2yc0yg6yt5yqq2clr4ofhwyv" // Replace with your TinyMCE API key
            initialValue="<p>This is the initial content of the editor</p>"
            init={editorConfig}
            onEditorChange={handleEditorChange}
            ref={editorRef}
        />
    );
};


// TinyMCE Editor Config..
const editorConfig = {
    height: 500,
    menubar: 'file edit view insert format tools table help',
    plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
    ],
    toolbar: `undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help`
};


export default MyEditor;