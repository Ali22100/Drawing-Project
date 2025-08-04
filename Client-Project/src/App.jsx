import { Routes, Route } from 'react-router-dom';
import { Home } from './Screen/Home';

import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
