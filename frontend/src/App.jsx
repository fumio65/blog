import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; 
import BlogView from './pages/BlogView';

import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<BlogView />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;