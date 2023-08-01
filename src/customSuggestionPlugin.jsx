const customSuggestionPlugin = (editor) => {
  editor.ui.registry.addAutocompleter('custom-suggestion', {
    ch: '{', // The trigger character that triggers the suggestion list
    minChars: 1, // Minimum number of characters to type before triggering the suggestion
    columns: 1, // Number of columns in the suggestion list
    fetch: (pattern) => {
      const suggestions = ['hello', 'height', 'width'];
      const matchedSuggestions = suggestions.filter((item) =>
        item.toLowerCase().includes(pattern.toLowerCase())
      );

      return new Promise((resolve) => {
        resolve(matchedSuggestions.map((item) => ({ value: item })));
      });
    },
    onAction: (autocompleteApi, rng, value) => {
      // Replace the typed '{' with the selected suggestion value
      editor.selection.setRng(rng);
      editor.insertContent(value);
    },
  });
};

export default customSuggestionPlugin;
