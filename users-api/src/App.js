import './App.css';
import UserList from './UserList';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Users Directory</h1>
        <p>List of users fetched from the JSONPlaceholder API with Axios</p>
      </header>
      <main className="app-main">
        <UserList />
      </main>
    </div>
  );
}

export default App;
