import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomeFeed from './pages/HomeFeed';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportIssue from './pages/ReportIssue';
import IssueDetails from './pages/IssueDetails';
import MapExplorer from './pages/MapExplorer';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomeFeed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/issue/:id" element={<IssueDetails />} />
            <Route path="/map" element={<MapExplorer />} />

            <Route path="/report" element={
              <ProtectedRoute allowedRoles={['Citizen', 'Admin']}>
                <ReportIssue />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute allowedRoles={['Citizen', 'Admin']}>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
