import './App.css';
import AllLists from './components/AllLists';
import Header from './components/Header';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


function App() {
  return (
    <div className="App">
      <Header />
      <DndProvider backend={HTML5Backend}>
        <AllLists />
      </DndProvider>
    </div>
  );
}

export default App;
