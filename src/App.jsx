import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import necessary Router components
import HomePage from './components/HomePage';
import Admin from './components/Admin';
import VideoPage from './components/VideoPage';
import UserProfile from './components/UserProfile';
import VideoPage2 from './components/Videopage2';
import VideoPage3 from './components/VideoPage3';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsofService';
import Footer from './components/Footer';
function App() {
  return (
    <Router> {/* Wrap your components in BrowserRouter */}
      <Routes> {/* Define all your route paths here */}
        <Route path="/" element={<HomePage />} /> {/* Define a route for HomePage */}
        <Route path="/admin" element={< Admin />} /> {/* Define a route for HomePage */}

        <Route path="/videos/:categoryName" element={<VideoPage />} />

        <Route path="/user-profile/:sub" element={<UserProfile />} />

        <Route path="/videoPage2/:sub" element={<VideoPage2 />} />

        <Route path="/video/:sub" element={<VideoPage3 />} />

        <Route path="/about" element={<AboutUs/>} />
        <Route path="/privacy" element={<PrivacyPolicy/>} />
        <Route path="/terms" element={<TermsOfService/>} />
        <Route path="/contact" element={<ContactUs/>} />





      </Routes>
      <Footer/>
      
    </Router>
  );
}

export default App;