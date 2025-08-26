import { KanbanProvider } from './context/KanbanContext';
import { KanbanBoard } from './components/KanbanBoard';

function App() {
  return (
    <KanbanProvider>
      <KanbanBoard />
    </KanbanProvider>
  );
}

export default App;
