import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Sidebar from "./Sidebar/Sidebar";

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div style={appStyle}>
        <Header />
        <Sidebar />
        <main style={mainStyle}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const appStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh'
};

const mainStyle = {
  marginLeft: "220px", // Adjust for sidebar width
  padding: "80px 20px", // Prevent overlap with fixed header/footer
  flex: 1,
  fontSize: "30px"
};

export default App;
