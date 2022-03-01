import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

import Home from "./pages/home";
import Navigation from "./components/navigation";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<p>Test</p> } />
        <Route path="*" element={<p>not found</p> } />
      </Routes>
    </Router>
  );
}

export default App;
