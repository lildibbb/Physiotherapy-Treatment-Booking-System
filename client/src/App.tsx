import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import DashboardPage from "./pages/dashboard";
import UserProfile from "./pages/user_profile";
import Appointment from "./pages/appointment";
import Book from "./pages/book";
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/auth/dashboard" element={<DashboardPage />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/user_profile" element={<UserProfile />} />
          <Route path="/auth/appointment" element={<Appointment />} />
          <Route path="/auth/book" element={<Book />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
