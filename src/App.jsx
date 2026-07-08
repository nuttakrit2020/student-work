import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SubjectSelection from './pages/SubjectSelection';
import AssignmentList from './pages/AssignmentList';
import { BookOpen } from 'lucide-react';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="header-title">
              <BookOpen className="header-icon" size={24} />
              ระบบส่งงานนักเรียน ม.1 - ม.6
            </div>
          </div>
        </header>

        <main className="container animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/class/:gradeId/:roomId" element={<SubjectSelection />} />
            <Route path="/class/:gradeId/:roomId/subject/:subjectId" element={<AssignmentList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
