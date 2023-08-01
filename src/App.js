import Editor from './Editor';
import Editor2 from './Editor2';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Editor2 />
        <br /> <br />

        <h1>TinyMCE Text Editor</h1>
        <Editor />
      </header>
    </div>
  );
}

export default App;
