import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Default route */}
          <Route path="/*" element={<LoginForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
