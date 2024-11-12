import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import SignupBusiness from "./pages/signupBusiness";
import DashboardPage from "./pages/dashboard";
import UserProfile from "./pages/user_profile";
import Appointment from "./pages/appointment";
import Book from "./pages/book";
import DoctorList from "./pages/doctorList";
import HomePageMerchant from "./pages/homePageMerchant";
import RequestResetPassword from "./pages/requestResetPassword";
import Staff from "./pages/staff";
import Therapist from "./pages/therapist";
import ResetPassword from "./pages/resetPassword";
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/auth/dashboard" element={<DashboardPage />} />
          <Route path="/merchant" element={<HomePageMerchant />} />
          <Route path="/auth/login" element={<Login />} />
          <Route
            path="/auth/request-reset-password"
            element={<RequestResetPassword />}
          />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/signup/user" element={<Signup />} />
          <Route path="/auth/signup/business" element={<SignupBusiness />} />
          <Route path="/auth/staff" element={<Staff />} />
          <Route path="/auth/therapist" element={<Therapist />} />
          <Route path="/auth/user_profile" element={<UserProfile />} />
          <Route path="/auth/appointment" element={<Appointment />} />
          <Route path="/auth/book" element={<Book />} />
          <Route path="/doctors/:hospitalId" element={<DoctorList />} />{" "}
          {/* Dynamic route for doctor list */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
