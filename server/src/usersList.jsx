import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserListado from './client/components/userList';

function App() {
  return (
    <Router basename="/usuarios">
      <Routes>
        <Route path="/" element={<UserListado />} />
      </Routes>
    </Router>
  );
}

export default App;