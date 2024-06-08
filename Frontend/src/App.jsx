
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {useState} from 'react'
import Login from './Pages/login';
import VehicleInfoForm from './Pages/VehicleInfoForm';
import './App.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <Router>
    <Routes>
      <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
      <Route path="/vehicle-info" element={loggedIn ? <VehicleInfoForm /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
  );
}

export default App
