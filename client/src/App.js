import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Footer from "./components/views/Footer/Footer";
import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import NavBar from './components/views/NavBar/NavBar';
import VideoUploadPage from './components/views/VideoUploadPage/VideoUploadPage';
import auth from './hoc/auth';

function App() {
  const AuthLandingPage = auth(LandingPage, null);
  const AuthLoginPage = auth(LoginPage, false);
  const AuthRegisterPage = auth(RegisterPage, false);
  const AuthVideoUploadPage = auth(VideoUploadPage, true);
  return (
    <>
      <Router>
        <NavBar/>
        <Routes>
          <Route path="/" element={<AuthLandingPage />} />
          <Route path="/login" element={<AuthLoginPage />} />
          <Route path="/register" element={<AuthRegisterPage />} />
          <Route path="/video/upload" element={<AuthVideoUploadPage />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
